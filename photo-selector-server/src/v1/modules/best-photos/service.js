/* cSpell:ignore errmsg */
const Database = require('./database');

const { validateOrderObject } = require('@v1/helpers');
/**
 *
 *
 * @param {*} userId
 * @param {*} orderId
 * @returns
 */
const getBestPhotosOrders = async (userId, orderId) => {

  try {

    if( ( !userId || userId === '' ) && ( !orderId || orderId === '' ) ) throw Error('Search parameters are empty');

    const query = {};

    if( userId ) query['userId'] = userId;

    if( orderId ) query['id'] = orderId;

    return await Database.findByQuery(query);
    
  } catch (error) {
    throw Error(error);
  }

};
/**
 *
 *
 * @param {*} photoOrder
 * @param {*} userId
 * @param {*} [orderId=null]
 * @returns
 */
const createOrUpdateBestPhotosOrder = async (photoOrder, userId, orderId = null) => {

  try {

    if( !userId || userId === '' ) throw Error('User Id not found');

    if( !photoOrder || photoOrder.length === 0 ) throw Error('Photos order not found');

    if( !validateOrderObject(photoOrder) ) throw Error('Order data validation fail');

    const query = { userId };

    if( orderId ) query['id'] = orderId;

    const existingRecord = await Database.findOneByQuery(query);

    if( existingRecord && orderId ) return await _updateExistingOrder(photoOrder, userId, orderId);
    
    return await _createNewOrder(photoOrder, userId);
    
  } catch (error) {
    throw Error(error);
  }

};

const _updateExistingOrder = async (photoOrder, userId, orderId) => {
  try {
    
    const updates = { 'order': photoOrder };

    const query = {};

    if( orderId ) query['id'] = orderId;

    if( userId ) query['userId'] = userId;

    return await Database.findOneByQueryAndUpdate(query, updates);

  } catch (error) {
    throw Error(error);
  }
};

const _createNewOrder = async (photoOrder = {}, userId = '') => {
  try {
    
    const order = {
      userId,
      order : photoOrder
    };

    return await Database.createPhotoOrder(order);

  } catch (error) {
    throw Error(error);
  }
};

module.exports = {
  getBestPhotosOrders,

  createOrUpdateBestPhotosOrder,
};