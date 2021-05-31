const Axios = require('axios');

const { LoggerModule } = require('@ComModules');

const { THROW_ERROR } = require('@src/helpers/responseHandlers');

/**
 * Handle axios requests
 *
 * @param {*} error
 */
const ErrorHandling = (error) => {
  if (error.response) {

    throw new Error({
      status: error.response.status,
      data: error.response.data,
    });

  } else if (error.request) {

    LoggerModule.error(error.request);

    throw new Error({
      status: 500,
      request: error.request,
    });

  } else {

    LoggerModule.error('Error', error.message);

    throw new Error({
      status: 500,
      message: error.message,
    });

  }
};
/**
 * HTTP requests using axios package
 *
 * @param {*} [configs=null]
 * @returns
 */
const AxiosRequest = async (configs = null) => {
  try {

    if (!configs) throw THROW_ERROR('Configs not found for the request', 400);

    return await Axios(configs)
      .then(response => response.data)
      .catch(ErrorHandling);

  } catch (error) {
    LoggerModule.error(error);
    THROW_ERROR(error, 500);
  }
};

module.exports = AxiosRequest;