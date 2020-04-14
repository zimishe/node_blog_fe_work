import React, { useState } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import qs from 'qs';
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

const UpdatePassword = () => {
  const classes = useStyles();
  const params = useParams();
  const location = useLocation();

  const query = qs.parse(location.search.slice(1));

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [fetching, setFetching] = useState(false);

  const onSubmit = async e => {
    e.preventDefault();

    setFetching(true);
    try {
      await axios
        .post(
          `${API_URL}/password/update/${params.userId}?token=${query.token}`,
          { password, passwordConfirmation },
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        )

      setFetching(false);
      setPassword("");
      setPasswordConfirmation("");
      setConfirmationVisible(true);
    } catch (err) {
      console.log(err)
    }
  }

  const isValid = [password, passwordConfirmation, password === passwordConfirmation]
    .every(condition => Boolean(condition));

  return (
    <Container style={{ margin: '20px auto' }} maxWidth="xs">
      <Typography variant="h6">Enter your email address to reset current password</Typography>
      <form onSubmit={onSubmit} className={classes.root}>
        <TextField
          required
          id="password"
          label="New password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <TextField
          required
          id="passwordConfirmation"
          label="Repeat new password"
          type="password"
          value={passwordConfirmation}
          onChange={e => setPasswordConfirmation(e.target.value)}
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
            Update password
          </Button>
        </div>
        {confirmationVisible && (
          <Typography variant="body2">
            Your password has been updated. You can now <Link to="/login">login</Link> with your new credentials
          </Typography>
        )}
      </form>
    </Container>
  )
}

export default UpdatePassword;
