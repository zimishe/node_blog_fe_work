import React from 'react'
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    marginBottom: 10,
  },
  media: {
    height: 100,
  },
  content: {
    padding: '5px 10px',
    textAlign: 'left',
    '&:last-child': {
      paddingBottom: '10px !important'
    }
  }
});

const Comment = ({
  text,
  createdAt,
  author
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent classes={{ root: classes.content }}>
        <Typography style={{ padding: '10px 0' }} variant="body2" color="textPrimary" component="p">
          {text}
        </Typography>
        <Divider />
        <Typography align="right" color="textPrimary" style={{ marginTop: 10 }} variant="body2" component="p">
          <b>{author.name}</b> at {moment(createdAt).format('MM/DD/YYYY HH:mm')}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Comment
