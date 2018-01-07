'use strict';

import app from '../..';
import Meal from './meal.model';
import User from '../user/user.model';
import request from 'supertest';

describe('Meal API:', function() {
  var users;
  var meals;
  var token;

  // Initiate users & meals before testing
  before(function(done) {
    User.remove().then(function() {
      User.create([{
        name: 'Fake User1',
        email: 'test1@example.com',
        password: 'test1'
      }, {
        name: 'Fake User2',
        email: 'test2@example.com',
        password: 'test2'
      }, {
        name: 'Fake Administrator',
        email: 'admin@example.com',
        role: 'admin',
        password: 'admin'
      }])
      .then((res) => {
        users = res;
        Meal.remove()
        .then(() => {
          Meal.create([{
            name: 'Fake Meal',
            calories: 100,
            date: new Date(),
            userid: users[0]._id
          }])
          .then((res) => {
            meals = res;
            
            request(app)
              .post('/auth/local')
              .send({
                email: 'test1@example.com',
                password: 'test1'
              })
              .end((err, res) => {
                token = res.body.token;
                done();
              });
          });
        });
      });
    });
  });
  
  // Clear users & meals after testing
  after(function() {
    return Meal.remove(function() {
      return User.remove();
    });
  });

  describe('GET /api/meals', function() {
    var admintoken = null;            //  token for administrator
    
    before(function(done) {
      request(app)
        .post('/auth/local')
        .send({
          email: 'admin@example.com',
          password: 'admin'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          admintoken = res.body.token;
          done();
        });
    });
    
    it('should respond with list of meals when authenticated as administrator', function(done) {
      request(app)
        .get('/api/meals')
        .set('authorization', 'Bearer ' + admintoken)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          res.body[0]._id.toString().should.equal(meals[0]._id.toString());
          done();
        });
    });
    
    it('should respond with a 403 when not a administrator', function(done) {
      request(app)
        .get('/api/meals')
        .set('authorization', 'Bearer ' + token)
        .expect(403)
        .end(done);
    });
  });
  
  describe('GET /api/meals/user', function() {
    it('should respond with list of meals of user', function(done) {
      request(app)
        .get('/api/meals/user')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          res.body[0]._id.toString().should.equal(meals[0]._id.toString());
          done();
        });
    });
    
    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/meals/user')
        .expect(401)
        .end(done);
    });
  });

  describe('POST /api/meals', function() {
    var newMeal = {
      name: 'New Meal',
      calories: 100,
      date: new Date(),
    };
        
    it('should respond with the newly created meal', function(done) {
      newMeal.userid = users[0]._id;
      request(app)
        .post('/api/meals')
        .set('authorization', 'Bearer ' + token)
        .send(newMeal)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          res.body.name.should.equal(newMeal.name);
          res.body.calories.toString().should.equal(newMeal.calories.toString());
          res.body.date.toString().should.equal(newMeal.date.toISOString());
          res.body.userid.toString().should.equal(newMeal.userid.toString());
          done();
        });
    });
  });

  describe('GET /api/meals/:id', function() {
    var othertoken = null, admintoken = null;
    var meal;

    before(function(done) {
      request(app)
        .post('/auth/local')
        .send({
          email: 'admin@example.com',
          password: 'admin'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          admintoken = res.body.token;
          if(othertoken) {
            done();
          }
        });
      request(app)
        .post('/auth/local')
        .send({
          email: 'test2@example.com',
          password: 'test2'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          othertoken = res.body.token;
          if(admintoken) {
            done();
          }
        });
    });
    
    it('should respond with the requested meal for owner', function(done) {
      request(app)
        .get('/api/meals/' + meals[0]._id)
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          res.body.name.should.equal(meals[0].name);
          res.body.calories.should.equal(meals[0].calories);
          res.body.date.toString().should.equal(meals[0].date.toISOString());
          res.body.userid.toString().should.equal(meals[0].userid.toString());
          done();
        });
    });
    
    it('should respond with the requested meal for administrator', function(done) {
      request(app)
        .get('/api/meals/' + meals[0]._id)
        .set('authorization', 'Bearer ' + admintoken)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          res.body.name.should.equal(meals[0].name);
          res.body.calories.should.equal(meals[0].calories);
          res.body.date.toString().should.equal(meals[0].date.toISOString());
          res.body.userid.toString().should.equal(meals[0].userid.toString());
          done();
        });
    });
    
    it('should respond with a 401 when not owner', function(done) {
      request(app)
        .get('/api/meals/' + meals[0]._id)
        .set('authorization', 'Bearer ' + othertoken)
        .expect(401)
        .end(done);
    });
       
    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/meals/' + meals[0]._id)
        .expect(401)
        .end(done);
    });
  });

  describe('PUT /api/meals/:id', function() {
    it('should respond with the updated meal', function(done) {
      request(app)
        .put('/api/meals/' + meals[0]._id)
        .set('authorization', 'Bearer ' + token)
        .send({
          name: 'Fake Updated Meal',
          calories: 120,
          date: meals[0].date,
          userid: users[0]._id
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          res.body.name.should.equal('Fake Updated Meal');
          res.body.calories.should.equal(120);
          res.body.date.toString().should.equal(meals[0].date.toISOString());
          res.body.userid.toString().should.equal(meals[0].userid.toString());
          done();
        });
    });
  });

  describe('DELETE /api/meals/:id', function() {    
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/meals/' + meals[0]._id)
        .set('authorization', 'Bearer ' + token)
        .expect(204)
        .end(done);
    });
    
    it('should respond with 404 when meal does not exist', function(done) {
      request(app)
        .delete('/api/meals/' + meals[0]._id)
        .set('authorization', 'Bearer ' + token)
        .expect(404)
        .end(done);
    });
  });

});
