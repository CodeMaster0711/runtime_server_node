'use strict';

angular.module('testProjectApp.users')
  .config(function ($stateProvider) {
    $stateProvider
      .state('users', {
        url: '/users',
        templateUrl: 'app/users/users.html',
        controller: 'UserController',
        controllerAs: 'users',
        authenticate: 'admin'
      });
  });
