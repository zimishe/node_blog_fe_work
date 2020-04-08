import React, { useState } from "react";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { API_URL, USER_ID_KEY, ACCESS_TOKEN_KEY } from "../App";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3, 2)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const Home = () => {
  const classes = useStyles();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [imageURl, setImageUrl] = useState("");

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
      const response = await getSignedrequest(image);
      await uploadFile(response.data.signedRequest, image);
      coverImageUrl = response.data.url;
      setImageUrl(response.data.url);
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
      .catch(function(error) {
        console.log(error);
      });
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <Paper elevation={1} className={classes.paper}>
            <form onSubmit={onSubmit} className="App">
              <h3>Publish article</h3>
              {imageURl && <img style={{ width: "100%" }} src={imageURl} alt="" />}
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                type="text"
                placeholder="Article title"
              />
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                type="textarea"
                placeholder="Article text"
              />
              <input
                onChange={onFileSelected}
                type="file"
                placeholder="Select article cover"
              />
              <button type="submit">Publish</button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={1} className={classes.paper}>
            articles list
          </Paper>
        </Grid>
      </Grid>
    </div>

  )
}

export default Home;
