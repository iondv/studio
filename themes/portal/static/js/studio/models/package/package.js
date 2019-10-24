"use strict";

Studio.PackageModel = function (app, data) {
  this.app = app;
  this.clear();
  Studio.Model.call(this, 'package:', app.studio, data);
};

$.extend(Studio.PackageModel.prototype, Studio.Model.prototype, {
  constructor: Studio.PackageModel,

  clear: function () {
  },

  // STORE

  exportData: function () {
    const data = Object.assign({}, this.getData());
    data.name = this.app.data.name;
    data.description = this.app.data.description;
    data.version = this.app.data.version;
    data.changeState = this.app.data.changedState;
    data.ionModulesDependencies = this.exportDependencyData('ionModulesDependencies');
    data.ionMetaDependencies = this.exportDependencyData('ionMetaDependencies');
    return Helper.Object.sortByKeys([
      'name',
      'description',
      'version',
      'ionModulesDependencies',
      'ionMetaDependencies'
    ], data);
  },

  exportDependencyData: function (name) {
    const source = this.data[name] || {};
    const items = this.app.data[name];
    const result = {};
    if (Array.isArray(items)) {
      for (const item of items) {
        result[item] = source[item] || '*';
      }
    }
    return result;
  },

  importData: function (data) {
    data = data || {};
    this.setData(data);
    this.clear();
    this.importDependencyData('ionModulesDependencies');
    this.importDependencyData('ionMetaDependencies');
  },

  importDependencyData: function (name) {
    if (!this.app.data[name]) {
      this.app.data[name] = this.data[name] ? Object.keys(this.data[name]) : [];
    }
  },

  afterImport: function () {
  }
});