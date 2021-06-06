/* eslint-disable no-async-promise-executor */
const handleErrors = (response) => {

  if (response.errorMessage) throw response;

  return response;

};

export const httpService = {

  /*`
  * inputs : {
  *     url : 'string',
  *     headers : 'object'
  * }
  * */
  get: (params) => {

    return new Promise(async (resolve, reject) => {

      const settings = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      };

      if (params && params.skipHeaders) delete settings.headers;

      return await fetch(params.url, settings)
        .then(response => response.json())
        .then(response => { resolve(response); })
        .then(handleErrors)
        .catch(err => reject(err));

    });

  },

  /*
  * inputs : {
  *   url : 'string',
  *   body : 'string/object/FormData',
  *   headers : 'object'
  * }
  * */
  post: (params) => {

    return new Promise(async (resolve, reject) => {

      const body = (params.body && (typeof params.body !== 'string') && !(params.body instanceof FormData)) ? JSON.stringify(params.body) : params.body;

      const settings = {
        method: 'POST',
        headers: {},
        body
      };

      const _headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      if (params.body && (typeof params.body !== 'string') && !(params.body instanceof FormData)) settings.headers = Object.assign(_headers, settings.headers);

      if (params && params.headers) {
        settings.headers = Object.assign(settings.headers, params.headers);
      }

      return await fetch(params.url, settings)
        .then(response => response.json())
        .then(handleErrors)
        .then(response => { resolve(response); })
        .catch(err => reject(err));
    });
  },

  /**
   * HTTP PUT Requests
   * @param {Object} params - { url, body, headers }
   */
  put: (params) => {

    return new Promise(async (resolve, reject) => {

      const body = (params.body && (typeof params.body !== 'string') && !(params.body instanceof FormData)) ? JSON.stringify(params.body) : params.body;

      const headers = !(params.body instanceof FormData) ? { 'Accept': 'application/json', 'Content-Type': 'application/json' } : {};
      const settings = {
        method: 'PUT',
        headers: headers,
        body
      };

      return await fetch(params.url, settings)
        .then(response => response.json())
        .then(handleErrors)
        .then(response => resolve(response))
        .catch(err => reject(err));
    });

  },

  /* TODO : query data handling */
  _utils: {

    // encodeQueryData: (data) => {

    // },

    // addQueryParams: (data) => {


    // },

    // updateQueryStringParameter: (uri, key, value) => {


    // }

  }

};

export default httpService;