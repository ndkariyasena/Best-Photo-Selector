/* *** Server starting point *** */

require('module-alias/register');

require('dotenv').config();

const { PORT, APP_NAME } = process.env;

const app = require('./src');

const onListeningLog = `${APP_NAME} server is running on port : ${PORT}`;

app.listen(PORT, () => console.log(onListeningLog));

module.exports = app;
