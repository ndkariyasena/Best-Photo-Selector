const { LoggerModule } = require('@ComModules');

const _getStrError = (err) => {

  if (typeof err === 'string') return err;

  if (err.message) return err.message;

  if (err.slack) return err.slack;

  if (typeof err === 'object') {

    return JSON.stringify(err);
  }

  return '';
};

const _getSuccess = (cc) => {

  if (!cc || !cc.message) return {};

  return { message: cc.message };
};

const _getError = (err) => {

  if (!err) return {};

  return { message: _getStrError(err) };
};

const UN_SUCCESS = { success: false };

const HTTP_CODE = {
  _200: { httpCode: 200, type: 'SUCCESS', code: 200, message: 'ok', success: true },
  _201: { httpCode: 201, type: 'SUCCESS', code: 201, message: 'created', success: true },
  _400: { httpCode: 400, type: 'BAD_REQUEST', code: 400, message: 'bad request', ...UN_SUCCESS },
  _401: { httpCode: 401, type: 'UNAUTHORIZED', code: 401, message: 'unauthorized', ...UN_SUCCESS },
  _403: { httpCode: 403, type: 'UNAUTHORIZED', code: 403, message: 'unauthorized', ...UN_SUCCESS },
  _404: { httpCode: 404, type: 'NOT_FOUND', code: 404, message: 'not found', ...UN_SUCCESS },
  _500: { httpCode: 500, type: 'INTERNAL_SERVER_ERROR', code: 500, message: 'server error', ...UN_SUCCESS },
};

const CUSTOM_CODE = {

  _200: (data, cc) => ({ ...HTTP_CODE._200, ..._getSuccess(cc), data: data }),

  _201: (data, cc) => ({ ...HTTP_CODE._201, ..._getSuccess(cc), data: data }),

  _400: (e) => ({ ...HTTP_CODE._400, ..._getError(e) }),

  _401: (e) => ({ ...HTTP_CODE._401, ..._getError(e) }),

  _403: (e) => ({ ...HTTP_CODE._403, ..._getError(e) }),

  _404: (e) => ({ ...HTTP_CODE._404, ..._getError(e) }),

  _500: (e) => ({ ...HTTP_CODE._500, ..._getError(e) }),
};

/**
 * Create error response
 * @param {Response} res - Response object
 * @param {number} code - Error code
 * @param {Object} error - Error object
 * @return {Object} Return HTTP Response
 */
const ERROR = (res, code, err) => {

  try {

    let response = CUSTOM_CODE._500(err);

    if (err && (err.code || code) && err.message) {

      const errorType = `_${(err.code || code)}`;

      if( errorType === '_400' ) response = CUSTOM_CODE._400(err);

      if( errorType === '_401' ) response = CUSTOM_CODE._401(err);
      
      if( errorType === '_403' ) response = CUSTOM_CODE._403(err);

      if( errorType === '_404' ) response = CUSTOM_CODE._404(err);

    }

    LoggerModule.error(err);

    return res.status(response.httpCode).json(response);

  } catch (catchErr) {

    LoggerModule.error(catchErr);
    LoggerModule.error(err);

    const response = CUSTOM_CODE._400(err);

    return res.status(response.httpCode).json(response);
  }

};

/**
 * Create succes response
 * @param {Response} res - Response object
 * @param {number} code - Http Success code
 * @param {*} data - Final result. object, array ...
 * @param {*} extra - Final result. object, array ...
 * @return {Object} Return HTTP Response: {
 *  code: 200,
 *  data: (*),
 *  success: true
 * }
 */
const SUCCESS = (res, code, data, extra = null) => {

  try {

    let response = CUSTOM_CODE._200(data, extra);

    if (code) {

      if( code === '_201' ) response = CUSTOM_CODE._201(data, extra);
      
    }

    return res.status(response.httpCode).json(response);

  } catch (error) {
    const response = CUSTOM_CODE._200(data);

    return res.status(response.httpCode).json(response);
  }

};
/**
 * Create a error
 * Log the error if it's a server error
 * @param {*} message
 * @param {*} code
 * @param {*} [extra={}]
 */
const THROW_ERROR = (message, code, extra = {}) => {

  if( message.status === 500 || message.code === 500 || code === 500 ) LoggerModule.error(message, extra);

  throw ({ code, message, ...extra });

};

module.exports = {

  HTTP_CODE,

  CUSTOM_CODE,

  ERROR,

  SUCCESS,

  THROW_ERROR,
};