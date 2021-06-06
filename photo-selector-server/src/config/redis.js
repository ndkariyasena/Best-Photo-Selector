/* cSpell:ignore setex */
const Redis = require('redis');

const { promisify } = require('util');

const Default_port = 6380;
const Default_host = 'redis';

let redisClient = null;

const createRedisClient = (option = {}) => {

  try {

    if (redisClient) return redisClient;

    // if ( Object.keys(option).length === 0 ) throw ('Redis configs are empty');

    redisClient = Redis.createClient(option);

    redisClient.on('connect', () => console.log(`Redis client running on ${option.host ? option.host : Default_host}:${option.port ? option.port : Default_port}`));

    redisClient.on('error', (err) => console.log('Config', 'redisClientConnection', err));

    redisClient.getAsync = promisify(redisClient.get).bind(redisClient);

    redisClient.setAsync = promisify(redisClient.set).bind(redisClient);

    redisClient.setexAsync = promisify(redisClient.setex).bind(redisClient);

    return redisClient;

  } catch (error) {
    console.log('redis client', 'redisClientConnection', error);
    throw new Error(error);
  }

};

module.exports = {
  createRedisClient,

  redisClient
};