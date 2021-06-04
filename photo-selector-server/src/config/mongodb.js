const mongoose = require('mongoose');

const chalk = require('chalk');

const API_VERSIONS = process.env?.API_VERSIONS;

const DB_NAMES = API_VERSIONS ? API_VERSIONS.split(' ').map((version) => `${version}_DB_NAME`) : [];

const connections = [];

const info = chalk.bold.blue;

const warning = chalk.bold.yellow;

const error = chalk.bold.red;

const throwError = (message) => {
  console.log(error(message));
  throw new Error(message);
};

const connect = (database, appVersion = null) => {

  try {

    const oldConnection = connections.find((c) => c.database === database);

    if (!oldConnection) {

      if (!appVersion) throwError('App version not found for MongoDB connections');

      let dbURL = process.env[`${appVersion}_DB_URL`];

      if (!dbURL) {

        const HOST = process.env[`${appVersion}_DB_HOST`];

        const PORT = process.env[`${appVersion}_DB_PORT`];

        if (!HOST || !PORT) throwError(`${appVersion} MongoDB connection parameters are missing`);

        dbURL = `mongodb://${HOST}:${PORT}/${database}`;

      }

      mongoose.set('useCreateIndex', true);

      mongoose.set('useFindAndModify', false);

      const connection = mongoose.createConnection(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      connections.push({
        database: database,
        dbURL: dbURL,
        conn: connection
      });

      connection.on('connected', () => {

        console.log(info('Connection is open to ', dbURL));

      });

      connection.on('error', (err) => {

        console.log(warning('Connection has occurred ' + err + ' error'));
      });

      connection.on('disconnected', () => {

        console.log(error('Connection is disconnected'));
      });

      process.on('SIGINT', () => {

        connection.close(() => {

          const termination = chalk.bold.magenta;

          console.log(termination('connection is disconnected due to application termination'));

          process.exit(0);
        });
      });

      return connection;
    }

    return oldConnection;

  } catch (error) {
    console.log(error);
    throw Error(error);
  }
};

const openConnections = (appVersion) => {

  const Db_prefix = `${appVersion}_`;

  const matches = DB_NAMES.filter((name) => name.match(Db_prefix));

  for (const name of matches) {
    connect(process.env[name], appVersion);
  }

};

const getConnection = (database, appVersion) => {

  const connection = connections.find((c) => c.database === database);

  if (connection) return connection.conn;

  return connect(database, appVersion);
};

const disconnected = (database) => {

  const connection = connections.find((c) => c.database === database);

  if (connection) {

    connection.conn.disconnected;

    const index = connections.findIndex((c) => c.database === database);

    connections.splice(index, 1);
  }
};

module.exports = {
  connect: connect,

  openConnections: openConnections,

  getConnection: getConnection,

  disconnected: disconnected,
};

