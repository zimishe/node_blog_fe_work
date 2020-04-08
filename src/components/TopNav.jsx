import React from 'react';
import { useLocation } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { USER_NAME_KEY } from '../App';

const TopNav = () => {
  const { pathname } = useLocation();
  const title = pathname === '/' ? 'Home' : pathname.slice(1, pathname.length);
  const name = localStorage.getItem(USER_NAME_KEY);

  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'space-between' }} variant="dense">
        <Typography variant="h6" color="inherit" style={{ textTransform: 'capitalize' }}>
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
