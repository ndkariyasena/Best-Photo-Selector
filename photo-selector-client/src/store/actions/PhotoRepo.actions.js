import { PhotoRepoTypes, CommonTypes } from "../constants";

import HTTP_SERVICE from "../service/httpService";

import Configs from "../../configs";

const SERVER_URL = Configs.EXTERNAL_URLS.SOURCE_SERVER;

export const getExistingPhoto = () => {

  return async dispatch => {

    try {

      dispatch({
        type: PhotoRepoTypes.GET_EXISTING_PHOTOS,
        payload: { status: CommonTypes.STATUS_PENDING }
      });

      const request = { url: SERVER_URL };

      return await HTTP_SERVICE.get(request)
        .then((response) => {

          if( response ) {

            dispatch({
              type: PhotoRepoTypes.GET_EXISTING_PHOTOS,
              payload: { 
                status: CommonTypes.STATUS_SUCCESS,
                photos: response,
               }
            });

            return response;

          }

          return [];

        })
        .catch((error) => {
          
          dispatch({
            type: PhotoRepoTypes.GET_EXISTING_PHOTOS,
            payload: { status: CommonTypes.STATUS_FAILED }
          });

          return error;

        });

    } catch (error) {
      throw error;
    }

  };

};