const mongoose = require('mongoose');

const { Database } = require('@config');

const Schema = mongoose.Schema;

const { DB_NAME } = process.env;

const conn = Database.getConnection(DB_NAME);

mongoose.connection = conn;

const BestPhotosSchema = new Schema({

  id: { type: String, required: true, index: true, unique: true },

  userId: { type: String, require: true, index: true },

  order: { type: Object },

}, { timestamps: true });

module.exports = mongoose.model('best-photos', BestPhotosSchema);
