/* cSpell:ignore upsert */
/* Counters handling */
/* This collection will keep records of all the key object types latest count */
const mongoose = require('mongoose');

const { Database } = require('@v1Config');

const Schema = mongoose.Schema;

const conn = Database.getConnection();

mongoose.connection = conn;

/* Schema */
const counterSchema = new Schema({

  _id: { type: String },

  seq: { type: Number, default: 0 },

}, { timestamps: true });
/*  */

counterSchema.statics.getNextSequence = async function ( counterName ) {

  if( !counterName ) return null;

  const ret = await this.findOneAndUpdate(
    { _id: counterName },
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true
    }
  );

  return ret.seq.toString().padStart(6, '0');
};

module.exports = mongoose.model('counter', counterSchema);