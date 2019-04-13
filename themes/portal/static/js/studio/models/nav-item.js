"use strict";

Studio.NavItemModel = function (parent, data) {
  this.app = parent.app;
  this.parent = parent;
  this.clear();
  Studio.Model.call(this, 'navItem:', this.app.studio, data);
};

$.extend(Studio.NavItemModel.prototype, Studio.Model.prototype, {
  constructor: Studio.NavItemModel,

  getFullName: function () {
    return this.data.name +'.'+ this.parent.getFullName();
  },

  getCode: function () {
    return this.isRootItem()
        ? this.data.name
        : this.parent.getCode() +'.'+ this.data.name;
  },

  isGroup: function () {
    return parseInt(this.data.type) === 0;
  },

  isClassPage: function () {
    return parseInt(this.data.type) === 1;
  },

  isContainerPage: function () {
    return parseInt(this.data.type) === 2;
  },

  isHyperlink: function () {
      return parseInt(this.data.type) === 3;
  },

  isRootItem: function () {
    return this.parent instanceof Studio.NavSectionModel;
  },

  getUrl: function () {
    return this.data.url;
  },

  getClass: function () {
    return this.app.getClass(this.data.classname);
  },

  getInterface: function () {
    return this.app.getInterface(this.data.interface);
  },

  clear: function () {
    this.items = [];
    this.itemMap = {};
    this.listView = null;
  },

  remove: function () {
    this.parent.removeItem(this);
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
    this.studio.triggerRemoveNavItem(model);
  },

  // LIST VIEW

  getListView: function () {
    return this.getClass() && this.listView;
  },

  ensureListView: function (classId) {
    if (this.listView && this.listView.cls !== this.app.getClass(classId)) {
      this.listView = null;
    }
    return this.listView;
  },

  createListView: function (data) {
    this.listView = null;
    var cls = this.getClass();
    if (cls) {
      this.listView = new Studio.ClassViewModel(cls, data);
      this.listView.copyAttrsFrom(cls.getViewByName('list'));
    }
    return this.listView;
  },

  removeListView: function () {
    this.listView = null;
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    data.items = Helper.Array.mapMethod('exportData', this.items);
    if (this.getListView()) {
      data.listView = this.listView.exportData();
    }
    this.normalizeExportData(data);
    return data;
  },

  normalizeExportData: function (data) {
    if (data) {
      data.type = parseInt(data.type);
      this.replaceIdToClassName('classname', data);
      this.replaceIdToInterface('interface', data);
    }
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
    this.normalizeImportData(this.data);
    this.importListView();
    Helper.Array.eachMethod('afterImport', this.items);
  },

  normalizeImportData: function (data) {
    if (data) {
      this.replaceClassNameToId('classname', data);
      this.replaceInterfaceToId('interface', data);
    }
    return data;
  },

  importListView: function () {
    var cls = this.getClass();
    if (this.data.listView && cls) {
      try {
        this.listView = new Studio.ClassViewModel(cls, this.data.listView);
      } catch (err) {
        console.error(err);
      }
    }
    delete this.data.listView;
  },

  afterUpload: function () {
    this.parseInterfaceFromUrl();
    Helper.Array.eachMethod('afterUpload', this.items);
  },

  parseInterfaceFromUrl: function () {
    var model = this.getInterface();
    var url = this.getUrl();
    if (model || !url) {
      return false;
    }
    var prefix = 'interfaces/'+ this.app.getName() +'/';
    if (url.indexOf(prefix) !== 0) {
      return false;
    }
    model = this.app.getInterfaceByName(url.substring(prefix.length));
    if (model) {
      this.data.interface = model.getId();
      this.data.url = '';
    }
  }
});
