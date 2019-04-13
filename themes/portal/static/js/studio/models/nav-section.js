"use strict";

Studio.NavSectionModel = function (app, data) {
  this.app = app;
  this.clear();
  Studio.Model.call(this, 'navSection:', app.studio, data);
};

$.extend(Studio.NavSectionModel.prototype, Studio.Model.prototype, {
  constructor: Studio.NavSectionModel,

  clear: function () {
    this.items = [];
    this.itemMap = {};
  },

  remove: function () {
    this.app.removeNavSection(this);
  },

  // NAV ITEM

  getNestedItems: function (id) {
    var items = this.items;
    for (var i = 0 ; i < this.items.length; ++i) {
      items = items.concat(this.items[i].getNestedItems());
    }
    return items;
  },

  getNestedItem: function (id) {
    if (this.itemMap[id]) {
      return this.itemMap[id];
    }
    for (var i = 0 ; i < this.items.length; ++i) {
      var item = this.items[i].getNestedItem(id);
      if (item) {
        return item;
      }
    }
  },

  getItems: function () {
    return this.items;
  },

  getItem: function (id) {
    return this.itemMap[id];
  },

  getItemByName: function (name) {
    return this.getItemByKeyValue(name, 'name');
  },

  getItemByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.items);
  },

  createItems: function (data) {
    if (data instanceof Array) {
      data.forEach(this.createItem, this);
    }
  },

  createItem: function (data) {
    return this.createNestedModel(data, this.items, this.itemMap, Studio.NavItemModel);
  },

  removeItem: function (model) {
    Helper.Array.removeValue(model, this.items);
    delete this.itemMap[model.id];
    this.app.updateMajorVersion();
    this.studio.triggerRemoveNavItem(model);
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    data.items = Helper.Array.mapMethod('exportData', this.items);
    return data;
  },

  importData: function (data) {
    data = data || {};
    this.setData(data);
    this.clear();
    this.createItems(data.items);
    delete this.data.items;
  },

  afterImport: function () {
    Helper.Array.eachMethod('afterImport', this.items);
  },

  afterUpload: function () {
    Helper.Array.eachMethod('afterUpload', this.items);
  }
});