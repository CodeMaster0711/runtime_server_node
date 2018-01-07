'use strict';

import app from '../..';
import Meal from './meal.model';
import User from './../user/user.model';
var user;
var meal;
var genMeal = function(done) {
  user = new User({
    provider: 'local',
    name: 'Fake User',
    email: 'test@example.com',
    password: 'password'
  });
  
  user.save().then((res) => {
    meal = new Meal({
      name: 'Fake Meal',
      calories: 100,
      date: new Date(),
      userid: res._id
    });
    done();
  });
};

describe('Meal Model', function() {
  before(function(done) {
    // Clear users before testing
    Meal.remove().then(() => {User.remove().then(() => {done();});})
  });

  beforeEach(function(done) {
    genMeal(done);
  });

  afterEach(function(done) {
    Meal.remove().then(() => {User.remove().then(() => {done();});})
  });

  it('should begin with no meal', function() {
    return Meal.find({}).exec().should
      .eventually.have.length(0);
  });

  describe('#name', function() {
    it('should fail when saving without an name', function() {
      meal.name = '';
      return meal.save().should.be.rejected;
    });
  });

  describe('#calories', function() {
    it('should fail when saving without calories or with invalid number', function() {
      meal.calories = 'a';
      return meal.save().should.be.rejected;
    });
  });
  
  describe('#date', function() {
    it('should fail when saving without an date or with an invalid date', function() {
      meal.date = '2015/10/37';
      return meal.save().should.be.rejected;
    });
  });
  
  describe('#userid', function() {
    it('should fail when saving without an userid', function() {
      meal.userid = '';
      return meal.save().should.be.rejected;
    });
    
    it('should authenticate if user is author', function() {
      meal.authenticate(meal.userid).should.be.true;
    });
    
    it('should not authenticate user if he is not author', function() {
      meal.authenticate('blah').should.not.be.true;
    });
  });

});
