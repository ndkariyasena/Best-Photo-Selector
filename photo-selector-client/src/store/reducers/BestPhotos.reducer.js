import { BestPhotosTypes } from "../constants";

const initialState = {
  orders: {},
  error: {},
  processStatus: null,
};

const auth = (state = initialState, action) => {
  switch (action.type) {

    case BestPhotosTypes.SAVE_PHOTO_ORDER: {

      const updates = {
        processStatus: (action.payload.status) ? action.payload.status : null,
      };

      if( action.payload.order && action.payload.order.id ) {

        updates['orders'] = { ...state.orders };
        const order = { ...action.payload.order };
        
        updates['orders'][order.id] = order;

      }

      return Object.assign({}, state, updates);
    }

    case BestPhotosTypes.GET_PHOTO_ORDER_BY_ID: {

      const updates = {
        processStatus: (action.payload.status) ? action.payload.status : null,
      };

      if( action.payload.order && action.payload.order.id ) {

        updates['orders'] = { ...state.orders };
        const order = { ...action.payload.order };
        
        updates['orders'][order.id] = order;

      }

      return Object.assign({}, state, updates);
    }

    case BestPhotosTypes.GET_PHOTO_ORDER_FOR_USER: {

      const updates = {
        processStatus: (action.payload.status) ? action.payload.status : null,
      };

      if( action.payload.orders && action.payload.orders.length > 0 ) {

        updates['orders'] = { ...state.orders };

        for( const order of action.payload.orders ) {
          updates['orders'][order.id] = order;
        }

      }

      return Object.assign({}, state, updates);
    }

    case BestPhotosTypes.UPDATE_PHOTO_ORDER: {

      const updates = {
        processStatus: (action.payload.status) ? action.payload.status : null,
      };

      if( action.payload.order && action.payload.order.id ) {

        updates['orders'] = { ...state.orders };
        const order = { ...action.payload.order };
        
        updates['orders'][order.id] = order;

      }

      return Object.assign({}, state, updates);
    }

    default:
      return state;
  }
};

export default auth;