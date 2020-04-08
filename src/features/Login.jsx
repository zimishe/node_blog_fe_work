import React, { useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { API_URL, USER_ID_KEY, USER_NAME_KEY, ACCESS_TOKEN_KEY } from '../App';

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

const Login = () => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fetching, setFetching] = useState(false);

  const onSubmit = async e => {
    e.preventDefault();

    setFetching(true);
    const { data } = await axios
      .post(
        `${API_URL}/login`,
        {
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
    localStorage.setItem(USER_ID_KEY, data.id);
    localStorage.setItem(USER_NAME_KEY, data.name);
    localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
    window.open('/', '_self');
  }

  const isValid = [email, password].every(item => Boolean(item));

  return (
    <Container style={{ margin: '20px auto' }} maxWidth="xs">
      <Typography variant="h4">Login</Typography>
      <form onSubmit={onSubmit} className={classes.root}>
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
            Login
          </Button>
        </div>
      </form>
      <Typography variant="body2">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </Typography>
    </Container>
  )
}

export default Login
