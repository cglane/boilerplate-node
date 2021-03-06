import mongoose from 'mongoose';
import util from 'util';

import config from '../../config/config';

const debug = require('debug')('Development Connection');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

//Create Connection
var mongoUri = config.mongo.dev.host;
console.log(mongoUri,'mongoUri');
var developmentConnection = mongoose.createConnection(mongoUri)

// Export Connections
module.exports = developmentConnection;

//On Success
developmentConnection.on('connected', function(res){
  console.log('Production DB connected')
})

// Error Handling
developmentConnection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env

if (config.MONGOOSE_DEBUG) {
  developmentConnection.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}
