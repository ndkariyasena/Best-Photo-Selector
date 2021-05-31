const Schema = require('./best-photos');

const { Counter } = require('@v1/module/counters');

const SEQUENCE = 'BEST-PHOTOS';

/**
 *
 *
 * @param {*} photoOrder
 * @returns
 */
const createPhotoOrder = async (photoOrder) => {

  const counter = await Counter.getNextSequence(SEQUENCE);

  photoOrder['id'] = `${photoOrder.userId}U${counter}`;

  return await Schema.create(photoOrder);

};

/**
 *
 *
 * @param {*} query
 * @param {*} [fields={}]
 */
const findOneByQuery = async (query, fields = {}) => await Schema.findOne(query, fields);

/**
 *
 *
 * @param {*} query
 * @param {*} options
 * @param {*} [fields={}]
 * @returns
 */
const findByQuery = async (query, options = null, fields = {}) => {

  const users = Schema.find(query, fields);

  if (options && options.sort) users.sort(options.sort);

  if (options && options.limit > 0) users.limit(options.limit);

  return await users;
};

/**
 *
 *
 * @param {*} query
 * @param {*} updates
 * @param {*} [options={}]
 */
const findOneByQueryAndUpdate = async (query, updates, options = {}) =>
  await Schema.findOneAndUpdate(query, updates, options);

module.exports = {
  createPhotoOrder,

  findOneByQuery,

  findByQuery,

  findOneByQueryAndUpdate,
};