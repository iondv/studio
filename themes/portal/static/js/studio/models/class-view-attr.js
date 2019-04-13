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
    return data;
  },

  afterImport: function () {
  }

});