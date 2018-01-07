'use strict';

(function() {

function UserResource($resource) {
  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    changeCaloriesLimit: {
      method: 'PUT',
      params: {
        controller: 'maxcalories'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    },
    update: {
      method:'PUT'
    }
  });
}

angular.module('testProjectApp.auth')
  .factory('User', UserResource);

})();
