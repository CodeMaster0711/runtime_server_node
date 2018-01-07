'use strict';

angular.module('testProjectApp')
  .factory('Modal', function($rootScope, $uibModal, $sce) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $uibModal.open() returns
     */
    function openModal(scope = {}, modalClass = 'modal-default', modalDialog = 'modal.html') {
      var modalScope = $rootScope.$new();

      angular.extend(modalScope, scope);

      return $uibModal.open({
        templateUrl: 'components/modal/' + modalDialog,
        windowClass: modalClass,
        scope: modalScope,
        resolve: {
          param: function() {
            return {'info': modalScope.info}
          }
        }
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete(del = angular.noop) {
          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed straight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;
 
            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm Delete',
                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Delete',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        },
        
        /**
         * Create a fnction to open a update user modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param {String}  update  - callback, ran when update is confirmed
         * @return {Function}       - the function to open the modal (ex. myModalFn)  
         */
        updateUser(update = angular.noop) {
          /**
           * Open a update user modal
           * @param   {String}  name  - user name to show on modal
           * @param   {All}           - any additional args are passed straight to update callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
              type = args.shift(),
              updateModal;
                        
            var scope = {
                dismissable: true,
                type: type,
                title: type === 'add' ? 'Add new user' : 'Update user info',
                name: args[0]['name'],
                email: args[0]['email'],
                password: '',
                buttons: [{
                  classes: 'btn-primary',
                  text: type === 'add' ? 'Add' : 'Update',
                  enable: 'modal.type != \'add\' || (modal.type === \'add\' && modal.password !== modal.confirmPassword)',
                  click: function(e) {
                    if(type === 'add' && ((scope.password != scope.confirmPassword))) {
                      scope.message = 'password must to be match';
                    }
                    else if(type === 'add' && scope.password.length < 3) {
                      scope.message = 'password must have at least 3 characters';
                    }
                    else {
                      scope.message = '';
                      updateModal.close(e);
                    }                    
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    updateModal.dismiss(e);
                  }
                }]
              };
            
            updateModal = openModal({
              modal: scope
            }, 'modal-danger', 'modal-user.html');
            
            updateModal.result.then(function(event) {
              if(type === 'add' || (scope.name !== args[0]['name'] || scope.email !== args[0]['email'])) {
                args[0]['name'] = scope.name;
                args[0]['email'] = scope.email;
                if(type === 'add') {
                  args[0]['password'] = scope.password;
                }
                update.apply(event, args);
              }
            });
          };
        },
        /**
         * Create a fnction to open a update record modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param {String}  update  - callback, ran when update is confirmed
         * @return {Function}       - the function to open the modal (ex. myModalFn)  
         */
        updateRecord(update = angular.noop) {
          /**
           * Open a update user modal
           * @param   {String}  name  - user name to show on modal
           * @param   {All}           - any additional args are passed straight to update callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
              type = args.shift(),
              updateModal;
              
            var scope = {
                dismissable: true,
                title: type === 'add' ? 'Add meal record' : 'Update meal record',
                name: args[0]['name'],
                calories: args[0]['calories'],
                date: new Date(args[0]['date']),
                time: new Date(args[0]['date']),
                buttons: [{
                  classes: 'btn-primary',
                  text: type === 'add' ? 'Add' : 'Update',
                  click: function(e) {
                    updateModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    updateModal.dismiss(e);
                  }
                }]
              };
            
            updateModal = openModal({
              modal: scope
            }, 'modal-danger', 'modal-record.html');
            
            updateModal.result.then(function(event) {
              if(scope.name !== args[0]['name'] || scope.calories !== args[0]['calories'] || scope.date !== new Date(args[0]['date']) || scope.time !== new Date(args[0]['date'])) {
                args[0]['name'] = scope.name;
                args[0]['calories'] = scope.calories;
                args[0]['date'] = scope.date.toDateString() + ' ' + scope.time.toTimeString();
                update.apply(event, args);
              }
            });
          };
        }
      }
    };
  });
