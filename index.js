const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const app = express();

const {
  APP_ID,
  DATABASE_URI,
  MASTER_KEY,
  REST_API_KEY,
  CLIENT_KEY,
  READ_ONLY_MASTER_KEY
} = process.env;

const api = new ParseServer({
  appName: 'Timer',
  // databaseURI: 'mongodb://mongo-parse-server/', // Connection string for your MongoDB database
  databaseURI: DATABASE_URI,//'mongodb://mongo-parse-server:27017/timer', 
  cloud: __dirname + '/cloud/main.js', // Absolute path to your Cloud Code
  appId: APP_ID,
  masterKey: MASTER_KEY,
  // restAPIKey: REST_API_KEY,
  // clientKey: CLIENT_KEY,
  // readOnlyMasterKey: READ_ONLY_MASTER_KEY,
  // serverURL: 'http://localhost:1337/parse', // Don't forget to change to https if needed
  liveQuery: {
    classNames: ['Game', 'Req' ,'GamePlayer','Player','Log']
  },
});

// Serve the Parse API on the /parse URL prefix
app.use('/parse', api);
app.get('/', (req, res) => res.redirect(301, '/parse'));

// Initialize a LiveQuery server instance, app is the express app of your Parse Server
let httpServer = require('http').createServer(app);
let port = process.env.LIVEQUERY_PORT || 1337;
httpServer.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(`httpServer api listening on ws://localhost: ${port}/parse`);
});
ParseServer.createLiveQueryServer(httpServer);
