const mongoose = require('mongoose');

const { Database } = require('@v1Config');

const Schema = mongoose.Schema;

const conn = Database.getConnection();

mongoose.connection = conn;

const BestPhotosSchema = new Schema({

  id: { type: String, required: true, index: true, unique: true },

  userId: { type: String, require: true, index: true },

  order: { type: Object },

  orderName: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('best-photos', BestPhotosSchema);
