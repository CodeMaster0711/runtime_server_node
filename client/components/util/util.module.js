'use strict';

angular.module('testProjectApp.util', ['ngNotificationsBar'])
.config(['notificationsConfigProvider', function(notificationsConfigProvider) {
  notificationsConfigProvider.setAutoHide(true);
  notificationsConfigProvider.setHideDelay(2500);
}]);