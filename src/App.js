import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route
} from "react-router-dom";
import io from 'socket.io-client';
import CssBaseline from '@material-ui/core/CssBaseline';
import Snackbar from '@material-ui/core/Snackbar';
import Home, { Alert } from './features/Home';
import Login from './features/Login';
import Signup from './features/Signup';
import ResetPassword from './features/ResetPassword';
import UpdatePassword from './features/UpdatePassword';
import Article from './features/Article';
import NotFound from './features/NotFound';
import TopNav from "./components/TopNav";
import "./App.css";

export const USER_ID_KEY = 'user_id';
export const USER_NAME_KEY = 'user_name';
export const ACCESS_TOKEN_KEY = 'access_token';
// export const API_URL = 'http://localhost:8000';
export const API_URL = 'https://fast-scrubland-94933.herokuapp.com';

const WEBSOCKET_URL = `${API_URL}/?${USER_ID_KEY}=${localStorage.getItem(USER_ID_KEY)}`;
let socket;

const App = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (localStorage.getItem(USER_ID_KEY) && !socket) {
      socket = io(WEBSOCKET_URL);

      socket.on('message', message => {
        setSnackbarOpen(true);
        console.log('dd', data)
        setData(message.data);
      })
    }
  });

  const handleClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
    setData(null);
  };

  const goToArticle = e => {
    e.preventDefault();

    window.open(`/articles/${data.articleId}`, '_blank')
  }

  return (
    <>
      <CssBaseline />
      <Router>
        <TopNav />
        <Switch>
          <Route path="/" exact>
            {localStorage.getItem(USER_ID_KEY) ? <Home /> : <Redirect to="/signup" />}
          </Route>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/password/reset" component={ResetPassword} />
          <Route path="/password/update/:userId" component={UpdatePassword} />
          <Route path="/articles/:id">
            {localStorage.getItem(USER_ID_KEY) ? <Article /> : <Redirect to="/signup" />}
          </Route>
          <Route path="/" component={NotFound} />
        </Switch>
        {data && (
          <Snackbar
            open={snackbarOpen}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="success"
            >
              {data.author && (
                <span>
                  New comment on your article!<br/>
                </span>
              )}
              <i style={{ fontWeight: 300 }}><b>{data.author.name}:</b> {data.text.slice(0, 30)}</i>
              <span
                onClick={goToArticle}
                style={{ cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}
              >
                See full
              </span>
            </Alert>
          </Snackbar>
        )}
      </Router>
    </>
  )
}

export default App;
