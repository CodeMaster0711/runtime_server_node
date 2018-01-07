'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var mealCtrlStub = {
  index: 'mealCtrl.index',
  show: 'mealCtrl.show',
  showusers: 'mealCtrl.showusers',
  create: 'mealCtrl.create',
  update: 'mealCtrl.update',
  destroy: 'mealCtrl.destroy'
};

var authServiceStub = {
    isAuthenticated() {
        return 'authService.isAuthenticated';
    },
    hasRole(role) {
        return 'authService.hasRole.' + role;
    },
    isOwner() {
        return 'authService.isOwner';
    }
}

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var mealIndex = proxyquire('./index', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './meal.controller': mealCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Meal API Router:', function() {

  it('should return an express router instance', function() {
    mealIndex.should.equal(routerStub);
  });

  describe('GET /api/meals', function() {

    it('should verify admin role and route to meal.controller.index', function() {
      routerStub.get
        .withArgs('/', 'authService.hasRole.admin', 'mealCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/meals/user/', function() {
     
     it('should be authenticated and route to meals.controller.showusers', function() {
         routerStub.get
           .withArgs('/user', 'authService.isAuthenticated', 'mealCtrl.showusers')
           .should.have.been.calledOnce;
     });

  });

  describe('POST /api/meals', function() {

    it('should be authenticated and route to meal.controller.create', function() {
      routerStub.post
        .withArgs('/', 'authService.isAuthenticated','mealCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/meals/:id', function() {

    it('should verify owner and route to meal.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'authService.isOwner','mealCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/meals/:id', function() {

    it('should verify owner and route to meal.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'authService.isOwner', 'mealCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/meals/:id', function() {

    it('should verify owner and route to meal.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'authService.isOwner', 'mealCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
