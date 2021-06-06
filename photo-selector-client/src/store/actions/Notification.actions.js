import { NotificationTypes } from '../constants';

export const addNotification = (notification = {}) => {
  return async dispatch => {
    dispatch({
      type: NotificationTypes.ADD_NOTIFICATION,
      payload: {
        notification,
      }
    });

    return true;
  };
};

export const removeNotification = (notificationId = null) => {
  return async dispatch => {

    if( !notificationId ) throw Error('Notification id not found');

    dispatch({
      type: NotificationTypes.REMOVE_NOTIFICATION,
      payload: {
        id: notificationId,
      }
    });

    return true;
  };
};

export const clearAllNotification = () => {
  return async dispatch => {

    dispatch({
      type: NotificationTypes.CLEAR_NOTIFICATIONS,
    });

    return true;
  };
};