"use strict";

Studio.DeployModuleModel = function (deploy, name, data) {
  this.deploy = deploy;
  this.name = name;
  this.app = deploy.app;
  this.clear();
  Studio.Model.call(this, 'deployModule:', this.app.studio, data);
  this.data.name = name;
};

Studio.DeployModuleModel.getClass = function (name) {
  switch (name) {
    case 'registry': return Studio.DeployModuleRegistryModel;
  }
  return Studio.DeployModuleModel;
};

$.extend(Studio.DeployModuleModel.prototype, Studio.Model.prototype, {
  constructor: Studio.DeployModuleModel,

  remove: function () {
    this.deploy.removeModule(this);
  },

  clearClassData: function (cls) {
  },

  updateClassData: function (cls) {
  }
});