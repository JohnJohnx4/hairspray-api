const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

const { users, stylists, services } = require('./data');

describe('Server', () => {
  let testUser = '';
  let testStylist = '';
  let testService = '';
  let testAppointment = '';
  let testFeedback = '';

  let userToken = '';
  let stylistToken = '';

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
    mongoose.connection.close(done);
  });

  // TODO
  // describe('Stripe', () => {});

  describe('[GET]', () => {
    describe('User', () => {
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

    describe('Stylist', () => {
      it('should get all stylists', done => {
        chai
          .request(app)
          .get('/api/stylists')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body[0].name.should.eql('Albert');
            done();
          });
      });
    });

    describe('Service', () => {
      it('should get all Service', done => {
        chai
          .request(app)
          .get('/api/service')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body[0].type.should.eql('Haircut');
            res.body[0].price.should.eql('$20');
            done();
          });
      });
    });

    describe('Appointment', () => {
      it('should get all Appointment', done => {
        chai
          .request(app)
          .get('/api/appointment')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.success.should.be.a('array');
            done();
          });
      });
    });

    describe('Feedback', () => {
      it('should get all Feedback', done => {
        chai
          .request(app)
          .get('/api/feedback')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.success.should.be.a('array');
            done();
          });
      });
    });
  });

  describe('[POST]', () => {
    describe('User', () => {
      it('should add a new User', done => {
        const testPostUser = {
          name: 'Tester',
          phone: '8888675309',
          email: 'tester@user.com',
          password: '123456'
        };
        chai
          .request(app)
          .post('/api/users')
          .send({ user: testPostUser })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.all.keys('success', 'token', '_id');
            userToken = res.body.token;
            testUser = res.body._id;
            done();
          });
      });
    });
    describe('Stylist', () => {
      it('should add a new Stylist', done => {
        const testPostStylist = {
          name: 'TestStylist',
          phone: '1111111111',
          email: 'test@stylist.com',
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
            res.body.should.have.all.keys('success', 'token', '_id');
            stylistToken = res.body.token;
            testStylist = res.body._id;
            done();
          });
      });
    });
    describe('Service', () => {
      it('should add a new Service', done => {
        const testPostService = { type: 'testPostService', price: '$100' };
        chai
          .request(app)
          .post('/api/service')
          .send({ service: testPostService })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.all.keys('success');
            testService = res.body.success;
            done();
          });
      });
    });
    describe('Appointment', () => {
      it('should add a new Appointment', done => {
        const testPostAppointment = {
          user: testUser,
          stylist: testStylist,
          session: '2019-05-01T18:08:54.341Z',
          service: [testService]
        };
        chai
          .request(app)
          .post('/api/appointment')
          .send({ appointment: testPostAppointment })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.all.keys('success');
            testAppointment = res.body.success;
            done();
          });
      });
    });

    describe('Feedback', () => {
      it('should add a new Feedback', done => {
        const testPostFeedback = {
          appointment: testAppointment,
          consultation: { feedback: 'Test consultation feedback', score: 3 },
          ontime: { feedback: 'Test ontime feedback', score: 3 },
          styling: { feedback: 'Test styling feedback', score: 3 },
          customer_service: {
            feedback: 'Test customer_service feedback',
            score: 3
          },
          overall: { feedback: 'Test overall feedback', score: 3 }
        };
        chai
          .request(app)
          .post('/api/feedback')
          .send({ feedback: testPostFeedback })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.all.keys('success');
            testFeedback = res.body.success;
            done();
          });
      });
    });
  });

  describe('[GET]/:id', () => {
    describe('User', () => {
      it('it should retrieve a user by id', done => {
        chai
          .request(app)
          .get(`/api/users/${testUser}`)
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
            res.body.should.have.property('_id', testUser);
            done();
          });
      });
    });
    describe('Stylist', () => {
      it('it should retrieve a user by id', done => {
        chai
          .request(app)
          .get(`/api/stylists/${testStylist}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name', 'TestStylist');
            res.body.should.have.property('email');
            res.body.should.have.property('password');
            res.body.should.have.property('date');
            res.body.should.have.property('_id');
            res.body.should.have.property('services');
            res.body.should.have.property('appointments');
            res.body.should.have.property('feedback');
            res.body.should.have.property('_id', testStylist);
            done();
          });
      });
    });
    describe('Service', () => {
      it('it should retrieve a service by id', done => {
        chai
          .request(app)
          .get(`/api/service/${testService}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('type', 'testPostService');
            res.body.should.have.property('price', '$100');
            done();
          });
      });
    });
    describe('Appointment', () => {
      it('it should retrieve a appointment by id', done => {
        chai
          .request(app)
          .get(`/api/appointment/${testAppointment}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.success.should.have.property('user');
            res.body.success.should.have.property('stylist');
            res.body.success.should.have.property('session', '2019-05-01T18:08:54.341Z');
            res.body.success.should.have.property('service');
            res.body.success.should.have.property('created');
            done();
          });
      });
    });
    describe('Feedback', () => {
      it('it should retrieve a feedback by id', done => {
        chai
          .request(app)
          .get(`/api/feedback/${testFeedback}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.success.should.have.property('appointment');
            res.body.success.should.have.property('consultation');
            res.body.success.should.have.property('ontime');
            res.body.success.should.have.property('styling');
            res.body.success.should.have.property('customer_service');
            res.body.success.should.have.property('overall');
            done();
          });
      });
    });
  });

  describe('[PUT]/:id', () => {
    describe('User', () => {
      it('it update a user by id', done => {
        chai
          .request(app)
          .put(`/api/users/${testUser}`)
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
            res.body.success.should.have.keys(
              'name',
              'appointments',
              'feedback',
              'email',
              'phone',
              'password',
              'date',
              '__v',
              '_id'
            );
            done();
          });
      });
    });
    describe('Stylist', () => {
      it('it updates a stylist by id', done => {
        chai
          .request(app)
          .put(`/api/stylists/${testStylist}`)
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
            res.body.success.should.have.property('_id', testStylist);
            done();
          });
      });
    });
    describe('Service', () => {
      it('it updates a Service by id', done => {
        chai
          .request(app)
          .put(`/api/service/${testService}`)
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
            res.body.success.should.have.property('_id', testService);
            done();
          });
      });
    });
    describe('Appointment', () => {
      it('it updates a Appointment by id', done => {
        chai
          .request(app)
          .put(`/api/appointment/${testAppointment}`)
          .send({session: '2020-10-10T18:08:54.341Z'})
          .end((err, res) => {
            if (err) {
              console.log('ERROR', err);
              done();
            }
            res.body.success.should.have.property('session', '2020-10-10T18:08:54.341Z');
            res.body.success.should.have.property('_id', testAppointment);
            done();
          });
      });
    });
    describe('Feedback', () => {
      it('it updates a Feedback by id', done => {
        chai
          .request(app)
          .put(`/api/feedback/${testFeedback}`)
          .send({consultation: { feedback: 'Updated Feedback', score: 2 },})
          .end((err, res) => {
            if (err) {
              console.log('ERROR', err);
              done();
            }
            res.body.success.consultation.should.have.property('feedback', 'Updated Feedback');
            res.body.success.consultation.should.have.property('score', 2);
            res.body.success.should.have.property('_id', testFeedback);
            done();
          });
      });
    });
  });

  describe('[DELETE]/:id', () => {
    describe('User', () => {
      it('it should remove a user by id', done => {
        chai
          .request(app)
          .delete(`/api/users/${testUser}`)
          // .set('Authorization', userToken)
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

    describe('Stylist', () => {
      it('it should remove a stylist by id', done => {
        chai
          .request(app)
          .delete(`/api/stylists/${testStylist}`)
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

    describe('Service', () => {
      it('it should remove a Service by id', done => {
        chai
          .request(app)
          .delete(`/api/service/${testService}`)
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

    describe('Appointment', () => {
      it('it should remove an Appointment by id', done => {
        chai
          .request(app)
          .delete(`/api/appointment/${testAppointment}`)
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

    describe('Feedback', () => {
      it('it should remove an Feedback by id', done => {
        chai
          .request(app)
          .delete(`/api/feedback/${testFeedback}`)
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
