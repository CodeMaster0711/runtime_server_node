'use strict';

angular.module('testProjectApp.records')
  .config(function ($stateProvider) {
    $stateProvider
      .state('records', {
        url: '/records',
        templateUrl: 'app/records/records.html',
        controller: 'RecordController',
        controllerAs: 'records',
        authenticate: 'user'
      });
  });
