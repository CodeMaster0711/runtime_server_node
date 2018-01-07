'use strict';

angular.module('testProjectApp.meal', [
  'testProjectApp.constants',
  'testProjectApp.util',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });