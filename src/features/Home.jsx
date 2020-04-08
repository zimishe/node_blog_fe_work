import React, { useState, useRef } from "react";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { API_URL, USER_ID_KEY, ACCESS_TOKEN_KEY } from "../App";
import ArticlesList from "../components/ArticlesList";

const Alert = props => <MuiAlert elevation={6} variant="filled" {...props} />;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3, 2),
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  bottom: {
    textAlign: 'center'
  },
  button: {
    margin: '20px auto',
    width: '200px'
  }
}));

const Home = () => {
  const classes = useStyles();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [fetching, setFetching] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const formRef = useRef(null);

  const isValid = [title, text].every(item => Boolean(item));

  const resetForm = () => {
    setText("");
    setTitle("");
    setImage("");
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  const getSignedrequest = async file => {
    try {
      return await axios.get(
        `${API_URL}/sign-s3?file-name=${file.name}&file-type=${file.type}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFile = async (signedRequest, file) => {
    await axios.put(signedRequest, file, {
      headers: {
        "Content-Type": file.type
      }
    });
  };

  const onFileSelected = e => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    let coverImageUrl;

    if (image) {
      setFetching(true);
      const response = await getSignedrequest(image);
      await uploadFile(response.data.signedRequest, image);
      coverImageUrl = response.data.url;
    }

    await axios
      .post(
        `${API_URL}/articles`,
        {
          title,
          text,
          coverImageUrl,
          author: {
            id: localStorage.getItem(USER_ID_KEY)
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
          }
        }
      )
      .catch(error => {
        console.log(error);
      });
      setFetching(false);
      setSnackbarOpen(true);
      resetForm()
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <Paper elevation={1} className={classes.paper}>
            <form ref={formRef} onSubmit={onSubmit} className="App">
              <Typography variant="h5">Publish article</Typography>
              <TextField
                required
                id="title"
                label="Article title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <TextField
                required
                id="text"
                label="Article text"
                type="textarea"
                multiline
                rows="5"
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <TextField
                id="file"
                type="file"
                placeholder="Select article cover"
                onChange={onFileSelected}
              />
              <div className={classes.bottom}>
                <Button
                  type="submit"
                  variant="contained"
                  className={classes.button}
                  color="primary"
                  size="large"
                  disabled={!isValid || fetching}
                >
                  Publish!
                </Button>
              </div>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={1} className={classes.paper}>
            <ArticlesList />
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          Article published!
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Home;
