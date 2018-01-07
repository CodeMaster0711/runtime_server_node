'use strict';

describe('Component: mainComponent', function() {

  // load the controller's module
  beforeEach(module('testProjectApp'));

  var scope, mainComponent;
  
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    mainComponent = $componentController('main', {
      $scope: scope
    });
  }));

  it('should...', function() {
    expect(1).toEqual(1);
  });
});
