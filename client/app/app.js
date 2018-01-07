'use strict';

angular.module('testProjectApp', [
  'testProjectApp.auth',
  'testProjectApp.users',
  'testProjectApp.records',
  'testProjectApp.meal',
  'testProjectApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'validation.match'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
