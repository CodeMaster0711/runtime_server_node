/**
 * Meal model events
 */

'use strict';

import {EventEmitter} from 'events';
import Meal from './meal.model';
var MealEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MealEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Meal.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    MealEvents.emit(event + ':' + doc._id, doc);
    MealEvents.emit(event, doc);
  }
}

export default MealEvents;
