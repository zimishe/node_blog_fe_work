import React, { useState, useEffect } from "react";
import moment from 'moment';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from "@material-ui/core/Divider";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Comment from "../components/Comment";
import StripeForm from '../components/StripeForm';
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
  },
  left: {
    textAlign: 'left'
  }
}));

const Article = () => {
  const params = useParams();
  const [fetching, setFetching] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [article, setArticle] = useState({});

  const classes = useStyles();

  useEffect(() => {
    const getArticle = async () => {
      const { data } = await axios
        .get(
          `${API_URL}/articles/${params.id}`,
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

        setArticle(data);
      }

      getArticle();
  }, [params.id])

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

    setFetching(true);
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

      setCommentText("");
      setFetching(false);
  };

  const getReport = async e => {
    e.preventDefault()

    setFetching(true);
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
    setFetching(false);

    window.open(`${API_URL}/${data}`, '__blank')
  }

  const { title, text, coverImageUrl, createdAt } = article;

  return (
    <>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <Paper elevation={1} className={classes.paper}>
              {coverImageUrl && <img style={{ height: 400 }} src={coverImageUrl} alt="img" />}
              <Grid container style={{ marginTop: 10 }}>
                <Grid item xs={12} sm={6}>
                  <Typography className={classes.left} color="primary" variant="h3">{title}</Typography>
                  <Typography className={classes.left} color="textSecondary" variant="subtitle1">{text}</Typography>
                  <Typography className={classes.left} variant="body2">{moment(createdAt).format('DD/MM/YYYY HH:MM')}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div className={classes.bottom}>
                    <Typography color="textPrimary" variant="h5">Get .pdf report</Typography>
                    <Button
                      type="button"
                      onClick={getReport}
                      variant="outlined"
                      className={classes.button}
                      color="secondary"
                      size="large"
                      disabled={fetching}
                    >
                      Get report <PictureAsPdfIcon style={{ marginLeft: 10 }} />
                    </Button>
                  </div>
                </Grid>
              </Grid>
              <Divider style={{ marginTop: 20 }} />
              <form className={classes.form} style={{ margin: "10px auto" }} onSubmit={postComment}>
                <Grid container>
                  <Grid item xs={12} sm={5}>
                    <Typography color="textPrimary" variant="h5">Send some comment!</Typography>
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
                        disabled={!commentText || fetching}
                      >
                        Send comment
                      </Button>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <Typography align="center" color="textPrimary" style={{ marginTop: 10 }} variant="h5">You can also donate</Typography>
                    <StripeForm />
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={1} className={classes.paper}>
            <Typography gutterBottom align="left" color="textPrimary" variant="subtitle1">Comments</Typography>
              {comments.length > 0
                ? comments.map(comment => <Comment key={comment.id} {...comment} />)
                : <Typography align="left" variant="body1">No comments yet. Be first!</Typography>
              }
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default Article
