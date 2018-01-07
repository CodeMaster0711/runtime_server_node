'use strict';

class SettingsController {
  constructor(Auth) {
    this.errors = {};
    this.submitted = false;
    this.calorieslimit = Auth.getCurrentUser().calorieslimit;
    this.Auth = Auth;
  }
  
  setUserLimit(value) {
    this.Auth.setMaxCalories(value)
      .then(() => {
        
      })
      .catch(() => {
        
      });
  }

  changePassword(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
    }
  }
}

angular.module('testProjectApp')
  .controller('SettingsController', SettingsController);
