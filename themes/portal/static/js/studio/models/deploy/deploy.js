"use strict";

Studio.DeployModel = function (app, data) {
  this.app = app;
  this.clear();
  this.createGlobal();
  Studio.Model.call(this, 'deploy:', app.studio, data);
};

$.extend(Studio.DeployModel.prototype, Studio.Model.prototype, {
  constructor: Studio.DeployModel,

  clear: function () {
    this.global = null;
    this.modules = [];
    this.moduleMap = {};
  },

  createGlobal: function (data) {
    this.global = new Studio.DeployGlobalModel(this.app, data);
  },

  // MODULES

  getModuleNames: function () {
    return Object.keys(this.moduleMap);
  },

  getModule: function (id) {
    return this.moduleMap[id];
  },

  getModuleByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.modules);
  },

  createModules: function (data) {
    let names = this.app.getModuleNames();
    if (names instanceof Array) {
      names.forEach(function (name) {
        this.createModule(name, data[Helper.Array.searchByValue(name, 'name', data)]);
      }, this);
    }
  },

  createModule: function (name, data) {
    try {
      var Class = Studio.DeployModuleModel.getClass(name);
      var form = this.studio.getDeployModuleForm(name);
      data = {...form.getDefaultValues(), ...data};
      var model = new Class(this, name, data);
      this.modules.push(model);
      this.moduleMap[model.name] = model;
    } catch (err) {
      console.error(err);
    }
  },

  updateModules: function () {
    let names = this.app.getModuleNames();
    if (names instanceof Array) {
      names.forEach(function (name) {
        if (!this.moduleMap.hasOwnProperty(name)) {
          this.createModule(name);
        }
      }, this);
    }
  },

  removeModule: function (model) {
    Helper.Array.removeValue(model, this.modules);
    delete this.moduleMap[model.name];
    this.studio.triggerRemoveDeployModule(model);
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    data.globals = this.global.exportData();
    data.modules = Helper.Array.mapMethod('exportData', this.modules);
    data.modules = Helper.Array.indexByKey('name', data.modules, true);
    return data;
  },

  importData: function (data) {
    data = data || {};
    this.setData(data);
    this.clear();
    this.createGlobal(data.globals);
    this.createModules(Helper.Object.getValuesWithKey('name', data.modules));
    delete this.data.globals;
    delete this.data.modules;
  },

  afterImport: function () {
    this.global.afterImport();
    Helper.Array.eachMethod('afterImport', this.modules);
  }
});