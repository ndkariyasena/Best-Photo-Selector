import { PhotoRepoTypes, CommonTypes } from "../constants";

import HTTP_SERVICE from "../service/httpService";

import Configs from "../../configs";

const BASE_URL = `${Configs.BASE_URLS.MANAGEMENT_SERVER}/photo-gallery`;

export const getExistingPhoto = (collectionId = null) => {

  return async dispatch => {

    try {

      if (!collectionId ) throw Error('Collection Id is empty');

      dispatch({
        type: PhotoRepoTypes.GET_EXISTING_PHOTOS,
        payload: { status: CommonTypes.STATUS_PENDING }
      });

      const request = {
        url: `${BASE_URL}/collection/${collectionId}`,
      };

      return await HTTP_SERVICE.get(request)
        .then((response) => {

          if (response && response.data ) {

            dispatch({
              type: PhotoRepoTypes.GET_EXISTING_PHOTOS,
              payload: { 
                status: CommonTypes.STATUS_SUCCESS,
                photos: response.data,
               }
            });

            return response.data;

          }

          return {};

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