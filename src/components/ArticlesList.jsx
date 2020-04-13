import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { ACCESS_TOKEN_KEY, API_URL } from '../App';

const useStyles = makeStyles({
  root: {
    marginBottom: 10
  },
  media: {
    height: 100,
  },
  content: {
    padding: '5px 10px',
    textAlign: 'left'
  }
});

const ArticleCard = ({
  id,
  title,
  text,
  coverImageUrl,
  createdAt
}) => {
  const classes = useStyles();

  return (
    <Link key={id} to={`/articles/${id}`} style={{ textDecoration: 'none' }}>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={coverImageUrl || '/static/images/cards/contemplative-reptile.jpg'}
            title="cover image"
          />
          <CardContent classes={{ root: classes.content }}>
            <Typography variant="h5" component="h5">
              {title}
            </Typography>
            <Typography color="textPrimary" style={{ marginBottom: 5 }} variant="body2" component="p">
              {text}
            </Typography>
            <Divider />
            <Typography variant="body2" color="textSecondary" component="p">
              {moment(createdAt).format('MM/DD/YYYY HH:mm')}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  )
}

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const getArticles = async () => {
      const response = await axios
        .get(
          `${API_URL}/articles`,

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

      setArticles(response ? response.data : []);
    }

    getArticles();
  }, [])


  return (
    <div style={{ height: '100vh', overflowY: 'scroll' }}>
      {articles.map(item => <ArticleCard key={item.id} {...item} />)}
    </div>
  )
}

export default ArticlesList
