const Service = require('./service');

const { Error_Response } = require('@v1/helpers');
/**
 * Get all best-photo collections by user ID
 *
 * @param {*} req
 * @param {*} res
 */
const getAllBestPhotosOrderForUser = async (req, res) => {

  try {

    const { userId } = req.params;

    const orders = await Service.getBestPhotosOrders(userId);

    res.status(200).json({ orders, count: orders.length });

  } catch (error) {
    Error_Response(res, error);
  }

};
/**
 * Get all best-photo collections by photo collection ID
 *
 * @param {*} req
 * @param {*} res
 */
const getAllBestPhotosOrderById = async (req, res) => {

  try {

    const { orderId } = req.params;

    const order = await Service.getBestPhotosOrders(null, orderId);

    res.status(200).json((order[0] ? order[0] : null));

  } catch (error) {
    Error_Response(res, error);
  }

};
/**
 * Get all best-photo collections by user ID or photo collection ID
 *
 * @param {*} req
 * @param {*} res
 */
const getBestPhotosOrder = async (req, res) => {

  try {

    const { userId, orderId } = req.query;

    const orders = await Service.getBestPhotosOrders(userId, orderId);

    res.status(200).json({ orders });

  } catch (error) {
    Error_Response(res, error);
  }

};
/**
 * Create a new best-photo collection
 *
 * @param {*} req
 * @param {*} res
 */
const createBestPhotosOrder = async (req, res) => {

  try {

    const { photoOrder, userId } = req.body;

    const orderObject = await Service.createOrUpdateBestPhotosOrder(photoOrder, userId);

    res.status(200).json(orderObject);

  } catch (error) {
    Error_Response(res, error);
  }

};
/**
 * Update existing collection
 *
 * @param {*} req
 * @param {*} res
 */
const updateBestPhotosOrder = async (req, res) => {

  try {

    const { photoOrder, userId, orderId } = req.body;

    const orderObject = await Service.createOrUpdateBestPhotosOrder(photoOrder, userId, orderId);

    res.status(200).json(orderObject);

  } catch (error) {
    Error_Response(res, error);
  }

};

module.exports = {
  getAllBestPhotosOrderForUser,

  getAllBestPhotosOrderById,

  createBestPhotosOrder,

  updateBestPhotosOrder,

  getBestPhotosOrder,
};
