"use strict";

Studio.InterfaceModel = function (app, data) {
  this.app = app;
  Studio.Model.call(this, 'interface:', app.studio, data);
};

$.extend(Studio.InterfaceModel.prototype, Studio.Model.prototype, {
  constructor: Studio.InterfaceModel,

  getUrl: function () {
    return 'interfaces/'+ this.app.getName() +'/'+ this.getName();
  },

  setEditorData: function (data) {
    this.data.editor = data;
  },

  getEditorData: function () {
    return this.data.editor;
  },

  remove: function () {
    this.app.removeInterface(this);
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    this.normalizeExportData(data);
    return data;
  },

  importData: function (data) {
    data = data || {};
    this.setData(data);
  },

  afterImport: function () {
    this.normalizeImportData(this.data);
  },
});