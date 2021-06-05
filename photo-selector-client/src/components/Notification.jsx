import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const Notification = (props) => {

  if( props.notifications.length === 0 ) return null;

  return (
    <div>
      {
        props.notifications.map((item) => (
          <Snackbar key={item.id} open={true} autoHideDuration={6000} onClose={() => props.closeNotifications(item.id)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
            <Alert onClose={() => props.closeNotifications(item.id)} severity={item.type}>
              {item.message}
            </Alert>
          </Snackbar>
        ))
      }
    </div>
  )
};

Notification.defaultProps = {
  notifications: [],
};

Notification.propTypes = {
  notifications: PropTypes.array.isRequired,
  closeNotifications: PropTypes.func.isRequired,
}

export default Notification

