const { Configs } = require('@v1Config');

const path = require('path');

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
/**
 * Will return public directory path
 *
 * @returns string
 */
const getPublicDir = () => {
  return path.join(process.cwd(), Configs.PUBLIC_DIR);
};

module.exports = {
  validateOrderObject,

  getPublicDir,
};