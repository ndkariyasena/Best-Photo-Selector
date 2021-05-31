const Service = require('./service');

const { ERROR, SUCCESS } = require('@src/helpers/responseHandlers');
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

    SUCCESS(res, 200, { orders, count: orders.length });

  } catch (error) {
    ERROR(res, 500, (error.message ? error.message : error ));
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

    SUCCESS(res, 200, (order[0] ? order[0] : null));

  } catch (error) {
    ERROR(res, 500, (error.message ? error.message : error ));
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

    SUCCESS(res, 200, { orders });

  } catch (error) {
    ERROR(res, 500, (error.message ? error.message : error ));
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

    SUCCESS(res, 201, orderObject);

  } catch (error) {
    ERROR(res, 500, (error.message ? error.message : error ));
  }

};
/**
 * Fully update existing collection
 *
 * @param {*} req
 * @param {*} res
 */
const updateBestPhotosOrder = async (req, res) => {

  try {

    const { photoOrder, userId, orderId } = req.body;

    const orderObject = await Service.createOrUpdateBestPhotosOrder(photoOrder, userId, orderId);

    SUCCESS(res, 201, orderObject);

  } catch (error) {
    ERROR(res, 500, (error.message ? error.message : error ));
  }

};

const checkPhotoOrdersForUser = async (req, res) => {

  try {

    const { userId } = req.params;

    const isAvailable = await Service.checkPhotoOrdersForUser(userId);

    SUCCESS(res, 201, isAvailable);

  } catch (error) {
    ERROR(res, 500, (error.message ? error.message : error ));
  }

};

module.exports = {
  getAllBestPhotosOrderForUser,

  getAllBestPhotosOrderById,

  createBestPhotosOrder,

  updateBestPhotosOrder,

  getBestPhotosOrder,

  checkPhotoOrdersForUser,
};
