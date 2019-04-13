"use strict";

Studio.TaskModel = function (app, data) {
  this.app = app;
  Studio.Model.call(this, 'task:', app.studio, data);
};

$.extend(Studio.TaskModel.prototype, Studio.Model.prototype, {
  constructor: Studio.TaskModel,

  getName: function () {
    return this.data.code;
  },

  getTitle: function () {
    return this.data.title === '' || this.data.title === undefined
        ? this.getName()
        : this.data.title;
  },

  getFullTitle: function () {
    return this.data.title === '' || this.data.title === undefined
        ? this.data.name
        : (this.data.title +' ('+ this.data.code +')');
  },

  remove: function () {
    this.app.removeTask(this);
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    this.normalizeExportData(data);
    return data;
  },

  normalizeExportData: function (data) {
    if (data) {
      this.replaceIdToWorkflowName('workflow', data);
    }
    return data;
  },

  importData: function (data) {
    data = data || {};
    this.setData(data);
  },

  afterImport: function () {
    this.normalizeImportData(this.data);
  },

  normalizeImportData: function (data) {
    if (data) {
      this.replaceWorkflowNameToId('workflow', data);
    }
    return data;
  },

  replaceWorkflowNameToId: function (key, data) {
    if (data.hasOwnProperty(key)) {
      let model = this.app.getWorkflowByName(data[key]);
      data[key] = model ? model.id : '';
    }
  },

  replaceIdToWorkflowName: function (key, data) {
    if (data.hasOwnProperty(key)) {
      let model = this.app.getWorkflow(data[key]);
      data[key] = model ? model.getName() : '';
    }
  },

});