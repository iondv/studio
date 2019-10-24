"use strict";

Studio.DeployGlobalPluginModel = function (global, data) {
  this.global = global;
  this.app = global.app;
  this.clear();
  Studio.Model.call(this, 'deployGlobalPlugin:', this.app.studio, data);
};

$.extend(Studio.DeployGlobalPluginModel.prototype, Studio.Model.prototype, {
  constructor: Studio.DeployGlobalPluginModel,

  remove: function () {
    this.global.removePlugin(this);
  }
});