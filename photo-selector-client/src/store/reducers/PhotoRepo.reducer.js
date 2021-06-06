/* cSpell:ignore signin */

import { PhotoRepoTypes, UserTypes } from '../constants';

const initialState = {
  author: {},
  details: {},
  collection: [],
  error: {},
  processStatus: null,
};

const auth = (state = initialState, action) => {
  switch (action.type) {

    case PhotoRepoTypes.GET_EXISTING_PHOTOS: {

      const updates = {
        processStatus: (action.payload.status) ? action.payload.status : null,
        processAction: PhotoRepoTypes.GET_EXISTING_PHOTOS,
      };

      if( action.payload.photos ) {

        const photos = { ...action.payload.photos };
        
        updates['author'] = { ...photos.author };
        updates['collection'] = [ ...photos.entries ];

        delete photos.author;
        delete photos.entries;

        updates['details'] = { ...photos };
      }

      return Object.assign({}, state, updates);
    }

    case UserTypes.GET_USER_DETAILS: {

      const updates = {
        processStatus: (action.payload.status) ? action.payload.status : null,
        processAction: PhotoRepoTypes.GET_USER_DETAILS,
      };

      if( action.payload.user ) {

        const user = { ...action.payload.user };

        updates['details'] = { code : user.collectionId };

        delete user.collectionId;
        
        updates['author'] = { ...user };
      }

      return Object.assign({}, state, updates);
    }

    case UserTypes.GET_USER_COLLECTIONS_DETAILS: {

      const updates = {
        processStatus: (action.payload.status) ? action.payload.status : null,
        processAction: PhotoRepoTypes.GET_USER_COLLECTIONS_DETAILS,
      };

      if( action.payload.details ) {

        const details = { ...action.payload.details };

        updates['details'] = { ...details };
      }

      return Object.assign({}, state, updates);
    }

    default:
      return state;
  }
};

export default auth;