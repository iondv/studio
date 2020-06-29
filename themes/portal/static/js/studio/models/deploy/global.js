"use strict";

Studio.DeployGlobalModel = function (app, data) {
  this.app = app;
  this.clear();
  Studio.Model.call(this, 'deployGlobal:', app.studio, data);
  this.data.staticOptions = this.data.staticOptions || {'maxAge': 3600000};
  this.data.lang = this.data.lang || Helper.L10n.getLanguage();
};

$.extend(Studio.DeployGlobalModel.prototype, Studio.Model.prototype, {
  constructor: Studio.DeployGlobalModel,

  clear: function () {
    this.moduleTitles = [];
    this.moduleTitleMap = {};
    this.topMenu = [];
    this.topMenuMap = {};
    this.plugins = [];
    this.pluginMap = {};
    this.jobs = [];
    this.jobMap = {};
  },

  // MODULE TITLES

  getModuleTitle: function (id) {
    return this.moduleTitleMap[id];
  },

  getModuleTitleByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.moduleTitles);
  },

  createModuleTitles: function (data) {
    if (data) {
      for (const key of Object.keys(data)) {
        if (data[key]) {
          if (typeof data[key] === 'string') {
            data[key] = {description: data[key]};
          }
          data[key].type = key;
          this.createModuleTitle(data[key]);
        }
      }
    }
  },

  createModuleTitle: function (data) {
    return this.createNestedModel(data, this.moduleTitles, this.moduleTitleMap, Studio.DeployGlobalModuleTitleModel);
  },

  removeModuleTitle: function (model) {
    Helper.Array.removeValue(model, this.moduleTitles);
    delete this.moduleTitleMap[model.id];
    this.studio.triggerRemoveDeployGlobalModuleTitle(model);
  },

  // TOP MENU

  getTopMenuItem: function (id) {
    return this.topMenuMap[id];
  },

  createTopMenu: function (data) {
    if (data instanceof Array) {
      data.forEach(this.createTopMenuItem, this);
    }
  },

  createTopMenuItem: function (data) {
    return this.createNestedModel(data, this.topMenu, this.topMenuMap, Studio.DeployGlobalTopMenuModel);
  },

  removeTopMenuItem: function (model) {
    Helper.Array.removeValue(model, this.topMenu);
    delete this.topMenuMap[model.id];
    this.studio.triggerRemoveDeployGlobalTopMenu(model);
  },

  // PLUGIN

  getPlugin: function (id) {
    return this.pluginMap[id];
  },

  getPluginByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.plugins);
  },

  createPlugins: function (data) {
    if (data instanceof Array) {
      data.forEach(this.createPlugin, this);
    }
  },

  createPlugin: function (data) {
    return this.createNestedModel(data, this.plugins, this.pluginMap, Studio.DeployGlobalPluginModel);
  },

  removePlugin: function (model) {
    Helper.Array.removeValue(model, this.plugins);
    delete this.pluginMap[model.id];
    this.studio.triggerRemoveDeployGlobalPlugin(model);
  },

  // JOB

  getJob: function (id) {
    return this.jobMap[id];
  },

  getJobByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.jobs);
  },

  createJobs: function (data) {
    if (data instanceof Array) {
      data.forEach(this.createJob, this);
    }
  },

  createJob: function (data) {
    return this.createNestedModel(data, this.jobs, this.jobMap, Studio.DeployGlobalJobModel);
  },

  removeJob: function (model) {
    Helper.Array.removeValue(model, this.jobs);
    delete this.jobMap[model.id];
    this.studio.triggerRemoveDeployGlobalJob(model);
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    data.moduleTitles = Helper.Array.mapMethod('exportData', this.moduleTitles);
    data.moduleTitles = Helper.Array.indexByKey('type', data.moduleTitles, true);
    data.explicitTopMenu = Helper.Array.mapMethod('exportData', this.topMenu);
    data.plugins = Helper.Array.mapMethod('exportData', this.plugins);
    data.plugins = Helper.Array.indexByKey('code', data.plugins, true);
    data.jobs = Helper.Array.mapMethod('exportData', this.jobs);
    data.jobs = Helper.Array.indexByKey('code', data.jobs, true);
    return data;
  },

  importData: function (data) {
    data = data || {};
    this.setData(data);
    this.clear();
    this.createModuleTitles(data.moduleTitles);
    this.createTopMenu(data.explicitTopMenu);
    this.createPlugins(Helper.Object.getValuesWithKey('code', data.plugins));
    this.createJobs(Helper.Object.getValuesWithKey('code', data.jobs));
    delete this.data.moduleTitles;
    delete this.data.explicitTopMenu;
    delete this.data.plugins;
    delete this.data.jobs;
  },

  afterImport: function () {
    Helper.Array.eachMethod('afterImport', this.topMenu);
  }
});