"use strict";

Studio.ClassPrintViewModel = function (cls, data) {
  this.app = cls.app;
  this.cls = cls;
  Studio.Model.call(this, 'classPrintView:', this.app.studio, data);
};

$.extend(Studio.ClassPrintViewModel.prototype, Studio.Model.prototype, {
  constructor: Studio.ClassPrintViewModel,

  getType: function () {
    return this.data.type;
  },

  getFile: function () {
    return Helper.File.get(this.data.file);
  },

  setData: function (data) {
    this.removeOldFiles(data);
    Object.assign(this.data, data);
  },

  remove: function () {
    this.removeOldFiles({});
    this.cls.removePrintView(this);
  },

  removeOldFiles: function (data) {
    if (this.data.file && this.data.file !== data.file) {
      Helper.File.remove(this.data.file);
    }
  },

  indexFiles: function (map) {
    if (this.data.file) {
      map[this.data.file] = true;
    }
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    return data;
  },

  importData: function (data) {
    this.setData(data);
  },

  afterImport: function () {
  }
});
