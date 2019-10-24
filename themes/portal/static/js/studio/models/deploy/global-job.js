"use strict";

Studio.DeployGlobalJobModel = function (global, data) {
  this.global = global;
  this.app = global.app;
  this.clear();
  Studio.Model.call(this, 'deployGlobalJob:', this.app.studio, data);
};

$.extend(Studio.DeployGlobalJobModel.prototype, Studio.Model.prototype, {
  constructor: Studio.DeployGlobalJobModel,

  remove: function () {
    this.global.removeJob(this);
  }
});