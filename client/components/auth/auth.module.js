'use strict';

angular.module('testProjectApp.auth', [
  'testProjectApp.constants',
  'testProjectApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
