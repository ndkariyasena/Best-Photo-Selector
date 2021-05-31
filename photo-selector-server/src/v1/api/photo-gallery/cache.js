/* cSpell:ignore setexAsync */
const { Redis } = require('@ComConfig');

const { Configs } = require('@v1Config');

const { THROW_ERROR } = require('@src/helpers/responseHandlers');

const Axios = require('@v1Modules/requests/axios');

const RedisClient = Redis.createRedisClient();
/**
 * Check is data cached under any name
 *
 * @param {*} [name=null]
 * @returns
 */
const checkIsDataCached = async (name = null) => {
  try {

    if( !name ) THROW_ERROR('Key name not found for cache checking');

    const collection = await RedisClient.getAsync(name);

    return (collection ? JSON.parse(collection) : collection);

  } catch (error) {
    throw new Error(error);
  }
};
/**
 * Fetch photos and cache them
 *
 * @param {*} [collectionId=null]
 * @returns
 */
const getPhotoCollectionAndCache = async (collectionId = null) => {
  try {

    const response = await getPhotoCollection(collectionId);

    /* TODO : resize images and cache in this service */

    /* Cache in redis service */
    await cacheCollectionDetails(collectionId, response);

    return response;

  } catch (error) {
    throw new Error(error);
  }
};
/**
 * fetch photos details
 *
 * @param {*} [collectionId=null]
 * @returns
 */
const getPhotoCollection = async (collectionId = null) => {
  try {

    const url = `${Configs.EXTERNAL_URLS.IMAGE_SOURCE_SERVER}/${collectionId}.json`;

    return await Axios({ url, method: 'get' });

  } catch (error) {
    throw new Error(error);
  }
};
/**
 * Cache details
 *
 * @param {*} cacheKey
 * @param {*} data
 * @returns
 */
const cacheCollectionDetails = async (cacheKey, data) => {
  try {

    const _data = (typeof data === 'object') ? JSON.stringify(data) : data;

    return await RedisClient.setexAsync(cacheKey, Configs.IMAGE_CACHE.TIME, _data);

  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  checkIsDataCached,

  getPhotoCollectionAndCache,
};