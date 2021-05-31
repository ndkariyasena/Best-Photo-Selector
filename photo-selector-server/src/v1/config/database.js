/* MongoDB connections handler */
const { MongoDB } = require('@ComConfig');

const API_VERSION = 'V1';

const DB_NAME = process.env[`${API_VERSION}_DB_NAME`];

/* Return existing connection or create a new connection and return */
const connect = () => (MongoDB.connect(DB_NAME, API_VERSION));

/* Read DB connections for this version and create new connections */
const openConnections = () => (MongoDB.openConnections(API_VERSION));

/* Get existing connections under this version */
const getConnection = () => (MongoDB.getConnection(DB_NAME, API_VERSION));

/* Disconnect connections */
const disconnected = () => (MongoDB.disconnected(DB_NAME, API_VERSION));

module.exports = {
  connect: connect,

  openConnections: openConnections,

  getConnection: getConnection,

  disconnected: disconnected,
};

