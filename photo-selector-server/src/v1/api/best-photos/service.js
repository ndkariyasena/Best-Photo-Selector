/* cSpell:ignore errmsg */
const Database = require('./database');

const { validateOrderObject } = require('@v1/helpers');

const { THROW_ERROR } = require('@src/helpers/responseHandlers');
/**
 * Get orders
 *
 * @param {*} userId
 * @param {*} orderId
 * @returns
 */
const getBestPhotosOrders = async (userId, orderId) => {

  try {

    /* Check primary requirements */
    if( ( !userId || userId === '' ) && ( !orderId || orderId === '' ) ) THROW_ERROR('Search parameters are empty', 400);

    /* Generate basic query */
    const query = {};

    if( userId ) query['userId'] = userId;

    if( orderId ) query['id'] = orderId;

    /* get data and return */
    return await Database.findByQuery(query);
    
  } catch (error) {
    THROW_ERROR(error);
  }

};

const checkPhotoOrdersForUser = async (userId) => {

  try {

    /* Check primary requirements */
    if( !userId || userId === '' ) THROW_ERROR('Search parameters are empty', 400);

    /* Generate basic query */
    const query = { userId };

    /* get data and return */
    const photoOrders = await Database.findByQuery(query);

    return ( photoOrders && photoOrders.length > 0 );
    
  } catch (error) {
    THROW_ERROR(error);
  }

};
/**
 * Create or Update orders
 *
 * @param {*} photoOrder
 * @param {*} userId
 * @param {*} [orderId=null]
 * @returns
 */
const createOrUpdateBestPhotosOrder = async (photoOrder, userId, orderId = null) => {

  try {

    /* Check primary requirements */
    if( !userId || userId === '' ) THROW_ERROR('User Id not found', 400);

    /* Check primary requirements */
    if( !photoOrder || photoOrder.length === 0 ) THROW_ERROR('Photos order not found', 400);

    /* Validate order object */
    if( !validateOrderObject(photoOrder) ) THROW_ERROR('Order data validation fail', 400);

    const query = { userId };

    if( orderId ) query['id'] = orderId;

    /* Check for existing orders */
    const existingRecord = await Database.findOneByQuery(query);

    /* If exist, update */
    if( existingRecord && orderId ) return await _updateExistingOrder(photoOrder, userId, orderId);
    
    /* Else create a new order */
    return await _createNewOrder(photoOrder, userId);
    
  } catch (error) {
    THROW_ERROR(error);
  }

};
/**
 * Update existing order
 *
 * @param {*} photoOrder
 * @param {*} userId
 * @param {*} orderId
 * @returns
 */
const _updateExistingOrder = async (photoOrder, userId, orderId) => {
  try {
    
    const updates = { 'order': photoOrder };

    const query = {};

    if( orderId ) query['id'] = orderId;

    if( userId ) query['userId'] = userId;

    return await Database.findOneByQueryAndUpdate(query, updates);

  } catch (error) {
    THROW_ERROR(error);
  }
};
/**
 * Create a new order
 *
 * @param {*} [photoOrder={}]
 * @param {string} [userId='']
 * @returns
 */
const _createNewOrder = async (photoOrder = {}, userId = '') => {
  try {
    
    const order = {
      userId,
      order : photoOrder
    };

    return await Database.createPhotoOrder(order);

  } catch (error) {
    THROW_ERROR(error);
  }
};

module.exports = {
  getBestPhotosOrders,

  createOrUpdateBestPhotosOrder,

  checkPhotoOrdersForUser,
};