#!/bin/sh

set -e

kubectl rollout restart deployments.apps/api -n anubis
kubectl rollout restart deployments.apps/web -n anubis
kubectl rollout restart deployments.apps/pipeline-api -n anubis
kubectl rollout restart deployments.apps/theia-proxy  -n anubis
kubectl rollout restart deployments.apps/rpc-default  -n anubis
kubectl rollout restart deployments.apps/rpc-theia  -n anubis
kubectl rollout restart deployments.apps/rpc-regrade  -n anubis
