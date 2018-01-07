/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/meals              ->  index
 * POST    /api/meals              ->  create
 * GET     /api/meals/:id          ->  show
 * PUT     /api/meals/:id          ->  update
 * DELETE  /api/meals/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Meal from './meal.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Meals
export function index(req, res) {
  return Meal.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Meal from the DB
export function show(req, res) {
  return Meal.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a user's meals
export function showusers(req, res) {
    return Meal.find({userid: req.user._id}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Meal in the DB
export function create(req, res) {
  if(!req.body.userid) {
    req.body.userid = req.user._id;
  }
  return Meal.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Meal in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Meal.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Meal from the DB
export function destroy(req, res) {
  return Meal.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
