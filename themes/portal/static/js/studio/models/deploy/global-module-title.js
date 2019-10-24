"use strict";

Studio.DeployGlobalModuleTitleModel = function (global, data) {
  this.global = global;
  this.app = global.app;
  this.clear();
  Studio.Model.call(this, 'deployGlobalModuleTitle:', this.app.studio, data);
};

Studio.DeployGlobalModuleTitleModel.sort = function (models) {
  return models.sort(Studio.DeployGlobalModuleTitleModel.compareByOrderNumber);
};

Studio.DeployGlobalModuleTitleModel.compareByOrderNumber = function (a, b) {
  return a.data.order - b.data.order;
};

$.extend(Studio.DeployGlobalModuleTitleModel.prototype, Studio.Model.prototype, {
  constructor: Studio.DeployGlobalModuleTitleModel,

  remove: function () {
    this.global.removeModuleTitle(this);
  }
});