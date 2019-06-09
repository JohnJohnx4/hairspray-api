const { getToken } = require('../config/auth');
const users = require('./users');
const stylists = require('./stylists');
const appointments = require('./appointments');
const feedback = require('./feedback');
const services = require('./services');
// const stripe = require('./stripe');

module.exports = app => {
  // app.route('/getToken').get((req, res) => res.send(getToken())); // for testing
  app.use('/api/users', users);
  app.use('/api/stylists', stylists);
  app.use('/api/appointment', appointments);
  app.use('/api/feedback', feedback);
  app.use('/api/service', services);
  // app.use('/api/stripe', stripe);
};
