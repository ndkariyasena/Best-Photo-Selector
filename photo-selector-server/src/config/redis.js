/* cSpell:ignore setex */
const Redis = require('redis');

const { promisify } = require('util');

// import { logErrorsInConsole, logDetailsInConsole, logSuccessInConsole } from "../../v1/helpers/utilities";

const Default_port = 6379;
const Default_host = '127.0.0.1';

let redisClient = null;

const createRedisClient = (option = {}) => {

  try {

    if (redisClient) return redisClient;

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