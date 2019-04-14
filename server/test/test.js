const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const { users, stylists, services } = require('./data');
const User = require('../models/User.js');

chai.use(chaiHttp);
chai.should();

var assert = require('assert');

describe('Server', () => {
  before(done => {
    mongoose.connect('mongodb://localhost:27017/hairspray');
    const db = mongoose.connection;
    db.on('error', () => {
      console.error('connection error');
    });
    db.once('open', () => {
      console.log('We are connected');
      User.collection.insert(users, err => {
        err ? console.log(err) : console.info('Successfully stored.');
      });
      done();
    });
  });

  after(done => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });

  describe('Array', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function() {
        assert.equal([1, 2, 3].indexOf(4), -1);
      });
    });
  });

  describe('Students', () => {
    describe('GET /', () => {
      // Test to get all users
      it('should get all users', done => {
        chai
          .request(app)
          .get('/api/users')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
          });
      });
      // // Test to get single student record
      // it('should get a single student record', done => {
      //   const id = 1;
      //   chai
      //     .request(app)
      //     .get(`/${id}`)
      //     .end((err, res) => {
      //       res.should.have.status(200);
      //       res.body.should.be.a('object');
      //       done();
      //     });
      // });

      // Test to get single student record
      it('should not get a single student record', done => {
        const id = 5;
        chai
          .request(app)
          .get(`/${id}`)
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });
  });
});
