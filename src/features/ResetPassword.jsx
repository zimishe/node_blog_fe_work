import React, { useState } from 'react';
import axios from "axios";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { API_URL } from '../App';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  bottom: {
    textAlign: 'center'
  },
  button: {
    margin: '20px auto',
    width: '200px'
  }
}));

const ResetPassword = () => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [fetching, setFetching] = useState(false);

  const onSubmit = async e => {
    e.preventDefault();

    setFetching(true);
    await axios
      .post(
        `${API_URL}/password/reset`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      )
      .catch(error => {
        console.log(error);
      });

    setFetching(false);
    setEmail("");
    setConfirmationVisible(true);
  }

  return (
    <Container style={{ margin: '20px auto' }} maxWidth="xs">
      <Typography variant="h6">Enter your email address to reset current password</Typography>
      <form onSubmit={onSubmit} className={classes.root}>
        <TextField
          required
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <div className={classes.bottom}>
          <Button
            type="submit"
            variant="contained"
            className={classes.button}
            color="primary"
            size="large"
            disabled={!email || fetching}
          >
            Reset
          </Button>
        </div>
        {confirmationVisible && (
          <Typography variant="body2">Reset password email was sent. Please check your inbox</Typography>
        )}
      </form>
    </Container>
  )
}

export default ResetPassword;
