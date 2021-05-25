/* cSpell:ignore signin */

import { PhotoRepoTypes } from "../constants";

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

    default:
      return state;
  }
};

export default auth;