"use strict";

Studio.ClassViewAttrModel = function (view, data) {
  this.view = view;
  this.cls = view.cls;
  this.app = view.app;
  Studio.Model.call(this, 'classViewAttr:', this.app.studio, data);
};

$.extend(Studio.ClassViewAttrModel.prototype, Studio.Model.prototype, {
  constructor: Studio.ClassViewAttrModel,

  isRequired: function () {
    return this.data.required;
  },

  getClassAttr: function () {
    if (!this._classAttr) {
      this._classAttr = this.cls.getAttrByName(this.data.name);
    }
    return this._classAttr;
  },

  getGroup: function () {
    return this.view.getGroup(this.data.group);
  },

  setGroup: function (group) {
    this.data.group = group ? group.id : null;
  },

  getType: function () {
    return this.data.type;
  },

  getTypeTitle: function () {
    return this.studio.classViewAttrForm.getValueLabel('type', this.getType());
  },

  remove: function () {
    this.view.removeAttr(this);
  },

  updateByClassAttr: function (classAttr) {
    if (this.getClassAttr() === classAttr) {
      this.data.name = classAttr.data.name;
    }
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    return this.normalizeExportData(data);
  },

  normalizeExportData: function (data) {
    if (data) {
      data.type = parseInt(data.type);
      this.replaceIdToGroupName(data);
    }
    return data;
  },

  afterImport: function () {
    this.normalizeImportData(this.data);
  },

  normalizeImportData: function (data) {
    this.replaceGroupNameToId(data);
  },

  replaceIdToGroupName: function (data) {
    var group = this.view.getGroup(data.group);
    data.group = group ? group.data.name : '';
  },

  replaceGroupNameToId: function (data) {
    var group = this.view.getGroupByName(data.group);
    data.group = group ? group.id : '';
  }
});