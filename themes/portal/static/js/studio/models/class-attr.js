"use strict";

Studio.ClassAttrModel = function (cls, data) {
  this.cls = cls;
  this.app = cls.app;
  Studio.Model.call(this, 'classAttr:', this.app.studio, data);
};

Studio.ClassAttrModel.getViewType = function (type) {
  type = parseInt(type);
  switch (type) {
    case 0: return 1;
    case 1: return 7;
    case 2: return 8;
    case 3: return 17;
    case 4: return 13;
    case 5: return 11;
    case 6: return 14;
    case 8: return 14;
    case 9: return 6;
    case 10: return 4;
    case 11: return 12;
    case 13: return 2;
    case 14: return 3;
    case 15: return 10;
    case 100: return 100;
    case 110: return 110;
    case 210: return 220;
  }
  return 1;
};

$.extend(Studio.ClassAttrModel.prototype, Studio.Model.prototype, {
  constructor: Studio.ClassAttrModel,

  isKey: function () {
    return this.cls.getKey() === this;
  },

  isGuid: function () {
    return parseInt(this.data.type) === 12;
  },

  getFullName: function () {
    return this.data.name +'.'+ this.cls.getFullName();
  },

  getViewType: function () {
    return Studio.ClassAttrModel.getViewType(this.data.type);
  },

  getRefClass: function (prop) {
    return this.app.getClass(this.data[prop]);
  },

  update: function (data) {
    Studio.Model.prototype.update.call(this, data);
    Helper.Array.eachMethod('updateByClassAttr', this.cls.views, this);
  },

  remove: function () {
    this.cls.removeAttr(this);
  },

  setAsDefaultKey: function () {
    if (!this.cls.getKey() && this.isGuid()) {
      this.cls.data.key = this.id;
      return true;
    }
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    data.type = parseInt(data.type);
    this.replaceIdToClassName('refClass', data);
    this.replaceIdToClassName('itemsClass', data);
    this.replaceIdToClassName('backRef', data);
    this.replaceIdToClassName('backColl', data);
    return data;
  },

  afterImport: function () {
    this.replaceClassNameToId('refClass', this.data);
    this.replaceClassNameToId('itemsClass', this.data);
    this.replaceClassNameToId('backRef', this.data);
    this.replaceClassNameToId('backColl', this.data);
  }
});