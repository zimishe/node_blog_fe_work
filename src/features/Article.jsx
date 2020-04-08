import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from "@material-ui/core/Divider";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import StripeForm from '../StripeForm';
import { API_URL, USER_ID_KEY, ACCESS_TOKEN_KEY } from '../App';

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
  },
  form: {
    textAlign: 'left'
  }
}));

const Article = () => {
  const params = useParams();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [article, setArticle] = useState({});

  const classes = useStyles();

  useEffect(() => {
    const getArticleComments = async () => {
      const { data } = await axios
        .get(
          `${API_URL}/articles/${params.id}/comments`,
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

        setComments(data);
      }

      getArticleComments();
  }, [params.id])

  const postComment = async e => {
    e.preventDefault();

    await axios
      .post(
        `${API_URL}/articles/${params.id}/comments`,
        {
          author: {
            id: localStorage.getItem(USER_ID_KEY)
          },
          text: commentText.trim()
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

  const getReport = async e => {
    e.preventDefault()

    const { data } = await axios
      .get(
        `${API_URL}/articles/${params.id}/report`,

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

    window.open(`${API_URL}/${data}`, '__blank')
  }

  return (
    <>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <Paper elevation={1} className={classes.paper}>
              <form className={classes.form} style={{ margin: "10px auto", width: 400 }} onSubmit={postComment}>
                <Typography variant="h5">Send some comment!</Typography>
                <TextField
                  required
                  id="text"
                  label="Comment"
                  type="textarea"
                  multiline
                  rows="3"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                />
                <div className={classes.bottom}>
                  <Button
                    type="submit"
                    variant="contained"
                    className={classes.button}
                    color="primary"
                    size="large"
                    // disabled={!isValid || fetching}
                  >
                    Send comment
                  </Button>
                </div>
                <Divider />
                <Typography style={{ marginTop: 10 }} variant="h5">Get article .pdf report!</Typography>
                <div className={classes.bottom}>
                  <Button
                    type="button"
                    onClick={getReport}
                    variant="contained"
                    className={classes.button}
                    color="secondary"
                    size="large"
                    // disabled={!isValid || fetching}
                  >
                    Get report
                  </Button>
                </div>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={1} className={classes.paper}>
              comments
            </Paper>
          </Grid>
        </Grid>
      </div>

      <StripeForm />
    </>
  )
}

export default Article
