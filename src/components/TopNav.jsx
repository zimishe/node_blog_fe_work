import React from 'react';
import { useLocation, useHistory } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import { USER_NAME_KEY } from '../App';

const TopNav = () => {
  const { pathname } = useLocation();
  const history = useHistory();
  const title = pathname === '/' ? 'Home' : pathname.slice(1, pathname.length);
  const name = localStorage.getItem(USER_NAME_KEY);

  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'space-between' }} variant="dense">
        <IconButton onClick={() => history.push('/')} edge="start" color="inherit" aria-label="home">
          <HomeIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" style={{ textTransform: 'capitalize', flexGrow: 1 }}>
          {title}
        </Typography>
        {name && (
          <Typography variant="body1" color="inherit">
            Hello there, <b>{name}</b>
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default TopNav
