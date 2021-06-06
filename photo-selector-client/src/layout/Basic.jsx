import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';

import Notification from '../components/Notification';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const Basic = (props) => {
  const classes = useStyles();

  return (
    <>
      <Notification />

      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Gallery
            </Typography>
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                {
                  props.authUser && props.authUser.picture ?
                    <Avatar alt={props.authUser.name} src={props.authUser.picture} /> :
                    <AccountCircle />
                }
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </div>
      {props.children}
    </>
  );
};


Basic.propTypes = {
  authUser: PropTypes.object,
  children: PropTypes.any,
};

const mapStateToProps = (state) => ({
  authUser: state.PhotoRepo.author,
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(Basic);

