'use strict';

(function(){

class RecordController {
  constructor(Meal, Modal, Auth, Util) {
    this.Meal = Meal;
    this.Util = Util;
    this.isAdmin = Auth.isAdmin;
    this.maxCalories = Auth.getCurrentUser().calorieslimit;
    this.newRecord = {name: 'New Meal', calories: 100, date: new Date().toISOString()};
    this.toDate = new Date();
    this.fromDate = new Date(new Date().getFullYear().toString() + '-01-01');
     
    // Use the Record $resource to fetch all records
    if(this.isAdmin() === true) {
      this.records = Meal.query();
    }
    else {
      this.records = Meal.getUserRecords();
    }
    // Delete record
    this.delete = Modal.confirm.delete(record => {
      record.$remove();
      this.Util.showSuccessMessage('Record successfully deleted');
      this.records.splice(this.records.indexOf(record), 1);
    });
    // Update record
    this.update = Modal.confirm.updateRecord(record => {
      record.$update();
      for(var index = 0; index < this.records.length; index++) {
        if(this.records[index]._id === record._id) {
          this.records[index].name = record.name;
          this.records[index].calories = record.calories;
          this.records[index].date = record.date;
          break;
        }
      }
      this.Util.showSuccessMessage('Record successfully updated');
    }, function(err) {
      this.Util.showErrorMessage(err.data.message);
      return this.Util.safeCb()(err);
    });
    // Add record
    this.add = Modal.confirm.updateRecord(record => {
      var recordCtrl = this;
      this.Meal.save(record, function(data) {
        recordCtrl.records.push(data);
        recordCtrl.Util.showSuccessMessage('Record successfully added');
      }, function(err) {
        recordCtrl.Util.showErrorMessage(err.data.message);
        return recordCtrl.Util.safeCb()(err);
      });
    });
  }
  // get Date from DateTime
  getDate(dateTime) {
    return new Date(dateTime).toDateString();
  }
  // get Time from DateTime
  getLocalTime(dateTime) {
    return new Date(dateTime).toLocaleTimeString();
  }
  // chceck if meets filter condition
  checkFilter(record) {
    var fromDate = new Date(this.fromDate);
    var toDate = new Date(this.toDate);
    var recordDate = new Date(record.date);
    if(recordDate > fromDate && recordDate < toDate) {
      return true;
    }
    return false;
  }
  //check if overpass limit
  overLimit(record) {
    var total = 0;
    this.records.map(function(item) {
      if(new Date(item.date).toDateString() === new Date(record.date).toDateString()) {
        total = total + item.calories;
      }
    });
    
    if(total > this.maxCalories) {
      return true;
    }
    return false;
  }
}

angular.module('testProjectApp.records')
  .controller('RecordController', RecordController);
  
})();
