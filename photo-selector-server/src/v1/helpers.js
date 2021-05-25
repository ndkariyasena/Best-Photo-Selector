/**
 * Format error response
 *
 * @param {*} res
 * @param {*} errorMessage
 */
const Error_Response = (res, errorMessage) => {
  try {
    const statusCode = (errorMessage && errorMessage.statusCode) ? errorMessage.statusCode : 500;

    res.status(statusCode).json({errorMessage});
    
  } catch (error) {
    res.status(500).json({errorMessage});
  }

};
/**
 * Validate photoOrder object in best-photos module 
 *
 * @param {*} [photoOrder={}]
 * @returns boolean
 */
const validateOrderObject = (photoOrder = {}) => {
  try {

    let valide = true;
    
    for( const key of Object.keys(photoOrder) ) {
      if( !( key.toString().length === 1 && key.match(/[0-8]/g) ) ) valide = false;
    }

    return valide;

  } catch (error) {
    throw Error(error);
  }
};

module.exports = {
  Error_Response,

  validateOrderObject,
};