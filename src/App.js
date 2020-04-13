import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
} from "react-router-dom";
import io from 'socket.io-client';
import CssBaseline from '@material-ui/core/CssBaseline';
import Home from './features/Home';
import Login from './features/Login';
import Signup from './features/Signup';
import Article from './features/Article';
import NotFound from './features/NotFound';
import "./App.css";
import TopNav from "./components/TopNav";

export const USER_ID_KEY = 'user_id';
export const USER_NAME_KEY = 'user_name';
export const ACCESS_TOKEN_KEY = 'access_token';
export const API_URL = 'http://localhost:8000';
// export const API_URL = 'https://fast-scrubland-94933.herokuapp.com';

const WEBSOCKET_URL = `${API_URL}/?${USER_ID_KEY}=${localStorage.getItem(USER_ID_KEY)}`;

// connect to websocket channel only after login
const socket = io(WEBSOCKET_URL);

socket.on('message', data => {
  console.log(data)
})

const App = () => (
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
        <Route path="/articles/:id">
          {localStorage.getItem(USER_ID_KEY) ? <Article /> : <Redirect to="/signup" />}
        </Route>
        <Route path="/" component={NotFound} />
      </Switch>
    </Router>
  </>
)

export default App;
