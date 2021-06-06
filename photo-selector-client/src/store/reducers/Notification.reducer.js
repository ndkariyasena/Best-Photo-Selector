/* cSpell:ignore signin noti */

import { NotificationTypes } from '../constants';

const initialState = {
  active: [],
  error: {},
  processStatus: null,
  processAction: null,
};

const auth = (state = initialState, action) => {
  switch (action.type) {

    case NotificationTypes.ADD_NOTIFICATION: {

      const updates = {
        processStatus: (action.payload.status) ? action.payload.status : null,
        processAction: NotificationTypes.ADD_NOTIFICATION,
      };

      if( action.payload.notification ) {

        const notification = { ...action.payload.notification, id: new Date().getTime() };

        updates['active'] = [ ...state.active ];
        
        updates.active.push(notification);
      }

      return Object.assign({}, state, updates);
    }

    case NotificationTypes.REMOVE_NOTIFICATION: {

      const updates = {
        processStatus: (action.payload.status) ? action.payload.status : null,
        processAction: NotificationTypes.REMOVE_NOTIFICATION,
      };

      if( action.payload.id ) {

        const notifications = [ ...state.active ];

        updates['active'] = [ ...state.active ];
        
        updates.active = notifications.filter((noti) => noti.id !== action.payload.id );
      }

      return Object.assign({}, state, updates);
    }

    case NotificationTypes.CLEAR_NOTIFICATIONS: {

      const updates = {
        processStatus: (action.payload.status) ? action.payload.status : null,
        processAction: NotificationTypes.CLEAR_NOTIFICATIONS,
      };

      updates['active'] = [];

      return Object.assign({}, state, updates);
    }

    default:
      return state;
  }
};

export default auth;