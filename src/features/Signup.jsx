import React, { useState } from 'react';
import { useHistory, Link } from "react-router-dom";
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

const Signup = () => {
  const classes = useStyles();
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fetching, setFetching] = useState(false);

  const onSubmit = async e => {
    e.preventDefault();

    setFetching(true);
    await axios
      .post(
        `${API_URL}/sign_up`,
        {
          name,
          email,
          password
        },
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
    history.push('/login');
  }

  const isValid = [name, email, password].every(item => Boolean(item));

  return (
    <Container style={{ margin: '20px auto' }} maxWidth="xs">
      <Typography variant="h4">Sign up</Typography>
      <form onSubmit={onSubmit} className={classes.root}>
        <TextField
          required
          id="name"
          label="Name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <TextField
          required
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          required
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
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
            Sign up
          </Button>
        </div>
      </form>
      <Typography variant="body2">
        Already have an account? <Link to="/login">Login here</Link>
      </Typography>
    </Container>
  )
}

export default Signup
