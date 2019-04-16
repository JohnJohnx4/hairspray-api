const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

const { users, stylists, services } = require('./data');
const User = require('../models/User');
const Stylist = require('../models/Stylist');
const Service = require('../models/Service');

describe('Server', () => {
  before(done => {
    mongoose.connect('mongodb://localhost:27017/hairspray', {
      useNewUrlParser: true
    });
    const db = mongoose.connection;
    db.on('error', () => {
      console.error('connection error');
    });

    db.once('open', () => {
      done();
    });
  });

  after(done => {
    mongoose.connection.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });

  describe('Users', () => {
    let userToken = '';

    User.collection.insertMany(users, err => {
      err ? console.log(err) : null;
    });
    describe('GET /', () => {
      it('should get all users', done => {
        chai
          .request(app)
          .get('/api/users')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body[0].name.should.eql('Alex');

            done();
          });
      });
    });

    describe('/GET/:id', () => {
      it('it should retrieve a user by id', done => {
        const testGet = new User({
          name: 'TesterGet',
          phone: '8888675308',
          email: 'testerGet@user.com',
          password: '123456'
        });

        testGet.save((err, user) => {
          chai
            .request(app)
            .get(`/api/users/${user._id}`)
            .send(user)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('name');
              res.body.should.have.property('phone');
              res.body.should.have.property('email');
              res.body.should.have.property('password');
              res.body.should.have.property('date');
              res.body.should.have.property('_id');
              res.body.should.have.property('appointments');
              res.body.should.have.property('feedback');
              res.body.should.have.property('_id', user._id.toString());
              done();
            });
        });
      });
    });

    describe('POST /', () => {
      it('should add a new User', done => {
        const testUser = {
          name: 'Tester',
          phone: '8888675309',
          email: 'tester@user.com',
          password: '123456'
        };
        chai
          .request(app)
          .post('/api/users')
          .send({ user: testUser })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.all.keys('success', 'token');
            userToken = res.body.token;
            done();
          });
      });
    });

    describe('/PUT/:id', () => {
      it('it update a user by id', done => {
        const testPut = new User({
          name: 'TesterPut',
          phone: '8888675307',
          email: 'testerPut@user.com',
          password: '123456'
        });

        testPut.save((err, user) => {
          chai
            .request(app)
            .put(`/api/users/${user._id}`)
            .set('Authorization', userToken)
            .send({
              name: 'Updated',
              email: 'updated@user.com',
              password: '123456'
            })
            .end((err, res) => {
              if (err) {
                console.log(err);
                done();
              }
              res.body.success.should.have.property('name', 'Updated');
              res.body.success.should.have.property(
                'email',
                'updated@user.com'
              );
              res.body.success.should.have.property('phone');
              res.body.success.should.have.property('password');
              res.body.success.should.have.property('date');
              res.body.success.should.have.property('_id', user._id.toString());
              done();
            });
        });
      });
    });

    describe('/DELETE/:id', () => {
      it('it should remove a user by id', done => {
        const testDelete = new User({
          name: 'TesterDelete',
          phone: '8888675305',
          email: 'testerDelete@user.com',
          password: '123456'
        });
        testDelete.save((err, user) => {
          chai
            .request(app)
            .delete(`/api/users/${user._id}`)
            .set('Authorization', userToken)
            .end((err, res) => {
              if (err) {
                console.log(err);
                done();
              }
              res.should.have.status(200);
              res.body.should.have.property('success');
              res.body.should.be.a('object');
              done();
            });
        });
      });
    });
  });

  describe('Stylists', () => {
    let stylistToken = '';

    Stylist.collection.insertMany(stylists, err => {
      err ? console.log(err) : null;
    });

    describe('GET /', () => {
      it('should get all stylists', done => {
        chai
          .request(app)
          .get('/api/stylists')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            // res.body[0].name.should.eql('Albert');
            done();
          });
      });
    });

    describe('POST /', () => {
      it('should add a new Stylist', done => {
        const testPostStylist = {
          name: 'TestPost',
          phone: '1111111111',
          email: 'TestPost@stylist.com',
          password: '123456',
          avatar: 'testimgurl'
        };
        chai
          .request(app)
          .post('/api/stylists')
          .send({ stylist: testPostStylist })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.all.keys('success', 'token');
            stylistToken = res.body.token;
            done();
          });
      });
    });

    describe('/GET/:id', () => {
      it('it should retrieve a user by id', done => {
        const testGetStylist = new Stylist({
          name: 'GetPost',
          email: 'GetPost@stylist.com',
          password: '123456',
          image: 'testimgurl'
        });

        testGetStylist.save((err, user) => {
          chai
            .request(app)
            .get(`/api/stylists/${user._id}`)
            .send(user)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('name', 'GetPost');
              res.body.should.have.property('email');
              res.body.should.have.property('password');
              res.body.should.have.property('date');
              res.body.should.have.property('_id');
              res.body.should.have.property('services');
              res.body.should.have.property('appointments');
              res.body.should.have.property('feedback');
              res.body.should.have.property('_id', user._id.toString());
              done();
            });
        });
      });
    });

    describe('/PUT/:id', () => {
      it('it updates a stylist by id', done => {
        const testPutStylist = new Stylist({
          name: 'testPut',
          email: 'testPut@stylist.com',
          password: '123456',
          avatar: 'testimgurl'
        });

        testPutStylist.save((err, stylist) => {
          if (err) {
            console.log(err);
            done();
          }
          chai
            .request(app)
            .put(`/api/stylists/${stylist._id}`)
            .set('Authorization', stylistToken)
            .send({
              name: 'Updated',
              email: 'updated@stylist.com'
            })
            .end((err, res) => {
              if (err) {
                console.log('ERROR', err);
                done();
              }
              res.body.success.should.have.property('name', 'Updated');
              res.body.success.should.have.property(
                'email',
                'updated@stylist.com'
              );
              res.body.success.should.have.property('password');
              res.body.success.should.have.property('date');
              res.body.success.should.have.property('services');
              res.body.success.should.have.property('appointments');
              res.body.success.should.have.property('feedback');
              res.body.success.should.have.property(
                '_id',
                stylist._id.toString()
              );
              done();
            });
        });
      });
    });

    describe('/DELETE/:id', () => {
      it('it should remove a stylist by id', done => {
        let testDeleteStylist = new Stylist({
          name: 'TestDelete',
          email: 'testDelete@stylist.com',
          password: '123456',
          avatar: 'testimgurl'
        });
        testDeleteStylist.save((err, stylist) => {
          if (err) {
            console.log(err);
            done();
          }
          chai
            .request(app)
            .delete(`/api/stylists/${stylist._id}`)
            .set('Authorization', stylistToken)
            .end((err, res) => {
              if (err) {
                console.log(err);
                done();
              }
              res.should.have.status(200);
              res.body.should.have.property('success');
              res.body.should.be.a('object');
              done();
            });
        });
      });
    });
  });

  describe('Services', () => {
    let serviceToken = '';

    Service.collection.insertMany(services, err => {
      err ? console.log(err) : null;
    });

    describe('GET /', () => {
      it('should get all Services', done => {
        chai
          .request(app)
          .get('/api/services')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body[0].type.should.eql('Haircut');
            res.body[0].price.should.eql('$20');
            done();
          });
      });
    });

    describe('POST /', () => {
      it('should add a new Service', done => {
        const testPostService = { type: 'testPostService', price: '$100' };
        chai
          .request(app)
          .post('/api/services')
          .send({ service: testPostService })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.all.keys('success');
            done();
          });
      });
    });

    describe('/GET/:id', () => {
      it('it should retrieve a service by id', done => {
        const testGetService = new Service({
          type: 'testGetService',
          price: '$100'
        });
        testGetService.save((err, service) => {
          chai
            .request(app)
            .get(`/api/services/${service._id}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('type', 'testGetService');
              res.body.should.have.property('price', '$100');
              done();
            });
        });
      });
    });

    describe('/PUT/:id', () => {
      it('it updates a Service by id', done => {
        const testPutService = new Service({
          type: 'testPutService',
          price: '$50'
        });

        testPutService.save((err, service) => {
          if (err) {
            console.log(err);
            done();
          }
          chai
            .request(app)
            .put(`/api/services/${service._id}`)
            // .set('Authorization', serviceToken)
            .send({
              type: 'UpdatedService',
              price: '$500'
            })
            .end((err, res) => {
              if (err) {
                console.log('ERROR', err);
                done();
              }
              res.body.success.should.have.property('type', 'UpdatedService');
              res.body.success.should.have.property('price', '$500');
              res.body.success.should.have.property(
                '_id',
                service._id.toString()
              );
              done();
            });
        });
      });
    });

    describe('/DELETE/:id', () => {
      it('it should remove a Service by id', done => {
        let testDeleteService = new Service({
          type: 'testDeleteService',
          price: '$10000'
        });
        testDeleteService.save((err, service) => {
          if (err) {
            console.log(err);
            done();
          }
          chai
            .request(app)
            .delete(`/api/services/${service._id}`)
            .end((err, res) => {
              if (err) {
                console.log(err);
                done();
              }
              res.should.have.status(200);
              res.body.should.have.property('success');
              res.body.should.be.a('object');
              done();
            });
        });
      });
    });
  });
  
  // TODO
  // describe('Feedback', () => {});
  // describe('Appointments', () => {});
  // describe('Stripe', () => {});
});
