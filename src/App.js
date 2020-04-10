import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
} from "react-router-dom";
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
// export const API_URL = 'http://localhost:8000';
export const API_URL = 'https://fast-scrubland-94933.herokuapp.com';

const WEBSOCKET_URL = `ws://fast-scrubland-94933.herokuapp.com:8001/?${USER_ID_KEY}=${localStorage.getItem(USER_ID_KEY)}`;

// connect to websocket channel only after login
const connection = new WebSocket(WEBSOCKET_URL);

connection.onerror = error => {
  console.log('e', error)
  console.log(`WebSocket error: ${error}`)
}

connection.onmessage = (e) => {
  console.log(e.data)
}

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
