/* cSpell:ignore errmsg */
const Cache = require('./cache');

const { THROW_ERROR } = require('@src/helpers/responseHandlers');

/**
 * TODO
 * Get collection by userId
 * @param {*} userId
 * @param {*} orderId
 * @returns
 */
const getPhotoCollectionsByUserId = async (userId) => {

  try {

    /* Check primary requirements */
    if( !userId || userId === '' ) THROW_ERROR('Search parameters are empty', 400);

    const photoCollection = [];
    

    return photoCollection;
    
  } catch (error) {
    THROW_ERROR(error);
  }

};
/**
 * Get collections data by collectionId
 *
 * @param {*} collectionId
 * @returns
 */
const getPhotoCollectionByCollectionId = async(collectionId) => {

  try {

    /* Check primary requirements */
    if( !collectionId || collectionId === '' ) THROW_ERROR('Search parameters are empty', 400);

    /* Check in cache */
    let photoCollection = await Cache.checkIsDataCached(collectionId);
    
    /* If data in the cache, send them */
    if( photoCollection ) return photoCollection;
    
    /* Else, fetch data and cache */
    photoCollection = await Cache.getPhotoCollectionAndCache(collectionId);

    return photoCollection;
    
  } catch (error) {
    THROW_ERROR(error);
  }

};

module.exports = {
  getPhotoCollectionsByUserId,

  getPhotoCollectionByCollectionId,
};