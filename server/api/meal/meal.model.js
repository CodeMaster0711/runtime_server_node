'use strict';

import moment from 'moment';
import mongoose from 'mongoose';
import User from './../meal/meal.model';

var MealSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  date: Date,
  userid: mongoose.Schema.ObjectId
});

/**
 * Validation
 */

// validate empty name
MealSchema
  .path('name')
  .validate(function(name) {
      return name.length;
  }, 'Name cannot be blank');
  
// validate calories as number
MealSchema
  .path('calories')
  .validate(function(calories) {
    return calories && !isNaN(calories);
  }, 'Calories need to be number');
  
  // validate date
MealSchema
  .path('date')
  .validate(function(date) {
      return date && moment(date).isValid();
  }, 'Date needs to be valid date');
  
// validate empty userid
MealSchema
  .path('userid')
  .validate(function(userid) {
    return userid.length;
  }, 'UserId cannot be blank');

/**
 * Methods
 */
MealSchema.methods = {
  /**
   * Authenticate - check if the user is author of the meal
   * @param {String}  userid
   * @param {Function}  callback
   * @return {Boolean}
   * @api public
   */
  authenticate(userid, callback) {
    if(!callback) {
      return this.userid.toString() === userid.toString();
    }
    if(this.userid.toString() === userid.toString()) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }
};

export default mongoose.model('Meal', MealSchema);
