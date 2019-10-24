"use strict";

Studio.AppDeploy = function (app) {
  this.app = app;
  this.studio = app.studio;
  this.deploy = app.deploy;
};

$.extend(Studio.AppDeploy.prototype, {
  constructor: Studio.AppDeploy,

  create: function () {
    var data = this.deploy.exportData();
    for (var key in data.modules) {
      if (data.modules.hasOwnProperty(key)) {
        this.resolveModuleData(data.modules[key], key);
      }
    }
    return data;
  },

  resolveModuleData: function (data) {
    delete data.logoFile;
  },

  getDefaultPage: function () {
    return this.app.interfaces.length ? this.app.interfaces[0].getName() : 'index';
  },

  getNavigation: function () {
    var result = {};
    this.app.interfaces.forEach(function (model) {
      result[model.getName()] = 'interfaces/'+ model.getName();
    });
    return result;
  }
});