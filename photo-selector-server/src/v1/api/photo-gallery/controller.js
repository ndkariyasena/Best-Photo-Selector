const Service = require('./service');

const { ERROR, SUCCESS } = require('@src/helpers/responseHandlers');

/**
 * Get all best-photo collections by user ID
 *
 * @param {*} req
 * @param {*} res
 */
const getPhotoCollectionsForUser = async (req, res) => {

  try {

    const { userId } = req.params;

    const collection = await Service.getPhotoCollectionsByUserId(userId);

    SUCCESS(res, 200, collection);

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
const getPhotoCollectionByCollectionId = async (req, res) => {

  try {

    const { collectionId } = req.params;

    const collection = await Service.getPhotoCollectionByCollectionId(collectionId);

    SUCCESS(res, 200, collection);

  } catch (error) {
    ERROR(res, 500, (error.message ? error.message : error ));
  }

};

module.exports = {
  getPhotoCollectionsForUser,

  getPhotoCollectionByCollectionId,
};
