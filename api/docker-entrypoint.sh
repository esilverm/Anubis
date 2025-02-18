#!/bin/sh

set -ex

echo 'Waiting for db...'
until mysqladmin ping -h "${DB_HOST}"; do
    sleep 1
done
echo 'db ready'

# echo 'Waiting for elasticsearch...'
# until curl -q http://elasticsearch:9200/; do
#     sleep 1
# done
# echo 'Elasticsearch ready'

echo 'Waiting a second'
sleep 1

if [ "${DEBUG}" = "1" ]; then
    set +e
    while true; do
        python3 dev.py
        sleep 1
        echo 'restarting'
    done
fi

if [ "${MIGRATE}" = "1" ]; then
    alembic upgrade head
fi

echo 'Starting api'
exec gunicorn ${GUNICORN_OPTIONS} \
    -w ${WORKERS:-4} \
    -b 0.0.0.0:5000 \
    "anubis.app:${CREATE_APP_FUNCTION:-create_app}()"
