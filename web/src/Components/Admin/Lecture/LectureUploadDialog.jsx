import React, {useState} from 'react';
import {useSnackbar} from 'notistack';
import axios from 'axios';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';

import standardErrorHandler from '../../../Utils/standardErrorHandler';
import standardStatusHandler from '../../../Utils/standardStatusHandler';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
  },
  input: {
    display: 'none',
  },
  field: {
    margin: theme.spacing(1, 1),
  },
}));


const uploadLecture = (state, enqueueSnackbar) => () => {
  const {
    file, setFile,
    number, setNumber,
    title, setTitle,
    setOpen,
    setReset,
  } = state;

  const form = new FormData();
  form.append('image', file);

  axios.post('/api/admin/lecture/upload', form, {
    params: {number, title, description: ''},
    headers: {'Content-Type': 'multipart/form-data'},
  }).then((response) => {
    const data = standardStatusHandler(response, enqueueSnackbar);
    if (data) {
      setReset((prev) => ++prev);
    }
  }).catch(standardErrorHandler(enqueueSnackbar));

  setOpen(false);
  setFile(null);
  setTitle('');
  setNumber(1);
};

export default function FileUploadDialog({setReset}) {
  const classes = useStyles();
  const {enqueueSnackbar} = useSnackbar();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [number, setNumber] = useState(0);
  const [title, setTitle] = useState('');

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const state = {
    setReset,
    open, setOpen,
    file, setFile,
    title, setTitle,
    number, setNumber,
  };

  return (
    <React.Fragment>
      <Button
        color={'primary'}
        variant={'contained'}
        onClick={handleOpen}
      >
        Upload Lecture
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Upload file</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Lecture Number"
            className={classes.field}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <TextField
            fullWidth
            className={classes.field}
            label={'Lecture Title'}
            variant={'outlined'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <List>
            <ListItem key={'file'}>
              <ListItemText
                primary={file === null ? 'please select a file' : file?.name}
              />
            </ListItem>
          </List>
          <input
            className={classes.input}
            id="upload-input"
            type="file"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setFile(e.target.files[0]);
              }
            }}
          />
          <label htmlFor="upload-input">
            <Button variant="contained" color="primary" component="span">
              Select File
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color="primary"
            variant="contained"
            disabled={file === null}
            onClick={uploadLecture(state, enqueueSnackbar)}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
