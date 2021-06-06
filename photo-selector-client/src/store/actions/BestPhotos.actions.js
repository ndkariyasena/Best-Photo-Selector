import { BestPhotosTypes, CommonTypes } from '../constants';

import HTTP_SERVICE from '../service/httpService';

import Configs from '../../configs';

const BASE_URL = `${Configs.BASE_URLS.MANAGEMENT_SERVER}/best-photos`;

export const getAllBestPhotoOrderForUser = (userId = null) => {

  return async dispatch => {

    if (!userId) throw Error('UserId is empty');

    dispatch({
      type: BestPhotosTypes.GET_PHOTO_ORDER_FOR_USER,
      payload: { status: CommonTypes.STATUS_PENDING }
    });

    const request = {
      url: `${BASE_URL}/user/${userId}`,
    };

    return await HTTP_SERVICE.get(request)
      .then((response) => {

        if (response && response.data && response.data.orders && response.data.orders.length > 0) {

          dispatch({
            type: BestPhotosTypes.GET_PHOTO_ORDER_FOR_USER,
            payload: {
              status: CommonTypes.STATUS_SUCCESS,
              orders: response.data.orders,
              userId,
            }
          });

          return response.data.orders;

        }

        return {};

      })
      .catch((error) => {

        dispatch({
          type: BestPhotosTypes.GET_PHOTO_ORDER_FOR_USER,
          payload: { status: CommonTypes.STATUS_FAILED }
        });

        return error;

      });

  };

};

export const isPhotoOrdesAvailableForUser = (userId = null) => {

  return async dispatch => {

    if (!userId) throw Error('UserId is empty');

    dispatch({
      type: BestPhotosTypes.IS_PHOTO_ORDERS_AVAILABLE,
      payload: { status: CommonTypes.STATUS_PENDING }
    });

    const request = {
      url: `${BASE_URL}/is-orders/${userId}`,
    };

    return await HTTP_SERVICE.get(request)
      .then((response) => {

        return response.data;

      })
      .catch((error) => {

        dispatch({
          type: BestPhotosTypes.GET_PHOTO_ORDER_FOR_USER,
          payload: { status: CommonTypes.STATUS_FAILED }
        });

        return error;

      });

  };

};

export const getBestPhotoOrderById = (orderId = null) => {

  return async dispatch => {

    if (!orderId) throw Error('OrderId is empty');

    dispatch({
      type: BestPhotosTypes.GET_PHOTO_ORDER_BY_ID,
      payload: { status: CommonTypes.STATUS_PENDING }
    });

    const request = {
      url: `${BASE_URL}/order/${orderId}`,
    };

    return await HTTP_SERVICE.get(request)
      .then((response) => {

        if (response.data && response.data.id) {

          dispatch({
            type: BestPhotosTypes.GET_PHOTO_ORDER_BY_ID,
            payload: {
              status: CommonTypes.STATUS_SUCCESS,
              order: response.data,
            }
          });

          return response.data;

        }

        return {};

      })
      .catch((error) => {

        dispatch({
          type: BestPhotosTypes.GET_PHOTO_ORDER_BY_ID,
          payload: { status: CommonTypes.STATUS_FAILED }
        });

        return error;

      });

  };

};

export const savePhotoOrder = (photoOrder = {}, userId = null) => {

  return async dispatch => {

    if (!userId) throw Error('UserId is empty');

    dispatch({
      type: BestPhotosTypes.SAVE_PHOTO_ORDER,
      payload: { status: CommonTypes.STATUS_PENDING }
    });

    const request = {
      url: `${BASE_URL}/`,
      body: { photoOrder, userId }
    };

    return await HTTP_SERVICE.post(request)
      .then((response) => {

        if (response.data && response.data.id) {

          dispatch({
            type: BestPhotosTypes.SAVE_PHOTO_ORDER,
            payload: {
              status: CommonTypes.STATUS_SUCCESS,
              order: response.data,
            }
          });

          return response.data;

        }

        return {};

      })
      .catch((error) => {

        dispatch({
          type: BestPhotosTypes.SAVE_PHOTO_ORDER,
          payload: { status: CommonTypes.STATUS_FAILED }
        });

        return error;

      });

  };

};

export const updatePhotoOrder = (photoOrder = {}, userId = null, orderId = null) => {

  return async dispatch => {

    if (!userId) throw Error('UserId is empty');

    if (!orderId) throw Error('UserId is empty');

    dispatch({
      type: BestPhotosTypes.UPDATE_PHOTO_ORDER,
      payload: { status: CommonTypes.STATUS_PENDING }
    });

    const request = {
      url: `${BASE_URL}/`,
      body: { photoOrder, userId, orderId }
    };

    return await HTTP_SERVICE.put(request)
      .then((response) => {

        if (response.data && response.data.id) {

          dispatch({
            type: BestPhotosTypes.UPDATE_PHOTO_ORDER,
            payload: {
              status: CommonTypes.STATUS_SUCCESS,
              order: response.data,
            }
          });

          return response.data;

        }

        return {};

      })
      .catch((error) => {

        dispatch({
          type: BestPhotosTypes.UPDATE_PHOTO_ORDER,
          payload: { status: CommonTypes.STATUS_FAILED }
        });

        return error;

      });

  };

};