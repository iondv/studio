"use strict";

Studio.ClassModel = function (app, data) {
  this.app = app;
  this.clear();
  Studio.Model.call(this, 'class:', app.studio, data);
};

Studio.ClassModel.DEFAULT_VIEW_NAMES = ['create', 'item', 'list'];

$.extend(Studio.ClassModel.prototype, Studio.Model.prototype, {
  constructor: Studio.ClassModel,

  getKey: function () {
    return  this.attrMap[this.data.key];
  },

  getParent: function () {
    return this.app.getClass(this.data.ancestor);
  },

  getDescendants: function () {
    var children = this.getChildren();
    var descendants = [].concat(children);
    children.forEach(function (child) {
      descendants = descendants.concat(child.getDescendants().filter(function (cls) {
        return descendants.indexOf(cls) === -1;
      }));
    });
    return descendants;
  },

  getChildren: function () {
    return this.app.classes.filter(function (cls) {
      return cls.data.ancestor === this.id;
    }, this);
  },

  clear: function () {
    this.clearAttrs();
    this.clearViews();
    this.clearPrintViews();
  },

  remove: function () {
    this.app.removeClass(this);
  },

  clone: function () {
    var data = $.extend(true, {}, this.exportData());
    data.name = 'clone-'+ data.name;
    data.caption = 'clone-'+ data.caption;
    data.options.uml.offset.left += 50;
    data.options.uml.offset.top += 50;
    var model = this.app.createClass(data);
    model.afterImport();
    return model;
  },

  indexFiles: function (map) {
    Helper.Array.eachMethod('indexFiles', this.printViews, map);
  },

  // ATTR

  getAttrs: function () {
    return Object.values(this.getAttrMapByName());
  },

  getAttr: function (id) {
    const parent = this.getParent();
    return this.attrMap[id] || (parent && parent.getAttr(id));
  },

  getAttrByName: function (name) {
    const map = this.getAttrMapByName();
    return map.hasOwnProperty(name) ? map[name] : null;
  },

  getAttrByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.getAttrs());
  },

  getAttrMapByName: function () {
    let map = this.indexAttrsByName();
    let parent = this.getParent();
    while (parent) {
      Helper.Object.assignUndefinedProperties(parent.indexAttrsByName(), map);
      parent = parent.getParent();
    }
    return map;
  },

  getAttrNames: function () {
    return this.getAttrs().map(attr => attr.getName());
  },

  isOwnEmpty: function () {
    return !this.attrs.length;
  },

  getOwnAttrs: function () {
    return this.attrs;
  },

  getOwnAttr: function (id) {
    return this.attrMap[id];
  },

  getOwnAttrByName: function (name) {
    return this.getOwnAttrByKeyValue(name, 'name');
  },

  getOwnAttrByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.attrs);
  },

  clearAttrs: function () {
    this.attrs = [];
    this.attrMap = {};
  },

  createAttrs: function (items) {
    if (items instanceof Array) {
      items.forEach(this.createAttr, this);
    }
  },

  createAttr: function (data) {
    return this.createNestedModel(data, this.attrs, this.attrMap, Studio.ClassAttrModel);
  },

  removeAttr: function (model) {
    Helper.Array.removeValue(model, this.attrs);
    Helper.Array.eachMethod('removeClassAttr', this.views, model);
    delete this.attrMap[model.id];
    this.app.updateMajorVersion();
    this.app.studio.triggerRemoveClassAttr(model);
  },

  indexAttrsByName: function () {
    var map = {};
    for (var i = 0; i < this.attrs.length; ++i) {
      map[this.attrs[i].data.name] = this.attrs[i];
    }
    return map;
  },

  // LINK

  clearLinks: function () {
    this.links = [];
  },

  createLinks: function () {
    this.clearLinks();
  },

  // VIEW

  getView: function (id) {
    return this.viewMap.hasOwnProperty(id) ? this.viewMap[id] : null;
  },

  getListView: function () {
    return this.getViewByName('list');
  },

  getViewByName: function (name) {
    return this.getViewByKeyValue(name, 'name');
  },

  getViewByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.views);
  },

  clearViews: function () {
    this.views = [];
    this.viewMap = {};
  },

  createDefaultViews: function (data) {
    for (var i = 0; i < Studio.ClassModel.DEFAULT_VIEW_NAMES.length; ++i) {
      var name = Studio.ClassModel.DEFAULT_VIEW_NAMES[i];
      var pos = Helper.Array.searchByValue(name, 'name', data.views);
      this.createView(pos !== -1 ? data.views[pos] : {'name': name});
    }
  },

  createViews: function (items) {
    if (items instanceof Array) {
      items.forEach(this.createView, this);
    }
  },

  createView: function (data) {
    return this.createNestedModel(data, this.views, this.viewMap, Studio.ClassViewModel);
  },

  removeView: function (model) {
    Helper.Array.removeValue(model, this.views);
    delete this.viewMap[model.id];
    this.app.studio.triggerRemoveClassView(model);
  },

  // VIEW ATTR

  getViewAttr: function (attrId, viewId) {
    var view = this.getView(viewId);
    return view ? view.getAttr(attrId) : null;
  },

  // PRINT VIEW

  getPrintViewsByType: function (type) {
    return this.printViews.filter(function (model) {
      return model.data.type === type;
    });
  },

  getPrintViewByHandler: function (handler) {
    for (var i = 0; i < this.printViews.length; ++i) {
      if (handler(this.printViews[i])) {
        return this.printViews[i];
      }
    }
  },

  getPrintView: function (id) {
    return this.printViewMap[id];
  },

  getPrintViewByName: function (name) {
    return this.getPrintViewByKeyValue(name, 'name');
  },

  getPrintViewByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.printViews);
  },

  clearPrintViews: function () {
    this.printViews = [];
    this.printViewMap = {};
  },

  createPrintViews: function (data) {
    if (data instanceof Array) {
      data.forEach(this.createPrintView, this);
    }
  },

  createPrintView: function (data) {
    return this.createNestedModel(data, this.printViews, this.printViewMap, Studio.ClassPrintViewModel);
  },

  removePrintView: function (model) {
    Helper.Array.removeValue(model, this.printViews);
    delete this.printViewMap[model.id];
    this.app.studio.triggerRemoveClassPrintView(model);
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    data.properties = Helper.Array.mapMethod('exportData', this.attrs);
    data.views = Helper.Array.mapMethod('exportData', this.views);
    data.printViews = Helper.Array.mapMethod('exportData', this.printViews);
    return this.normalizeExportData(data);
  },

  normalizeExportData: function (data) {
    if (data) {
      this.replaceIdToClassName('ancestor', data);
      this.replaceIdToClassAttrName('changeTracker', data, this);
      this.replaceIdToClassAttrName('creationTracker', data, this);
      this.normalizeExportKeyAttr(data);
    }
    return data;
  },

  normalizeExportKeyAttr: function (data) {
    this.replaceIdToClassAttrName('key', data, this);
    data.key = [data.key];
  },

  importData: function (data) {
    data = data || {};
    this.setData(data);
    this.clear();
    this.createAttrs(data.properties);
    this.createDefaultViews(data);
    this.createPrintViews(data.printViews);
    delete this.data.properties;
    delete this.data.views;
    delete this.data.printViews;
  },

  afterImport: function () {
    this.normalizeImportData(this.data);
    Helper.Array.eachMethod('afterImport', this.attrs);
  },

  normalizeImportData: function (data) {
    if (data) {
      this.replaceClassNameToId('ancestor', data);
      this.replaceClassAttrNameToId('changeTracker', data, this);
      this.replaceClassAttrNameToId('creationTracker', data, this);
      this.normalizeImportKeyAttr(data);
    }
    return data;
  },

  normalizeImportKeyAttr: function (data) {
    data.key = data.key instanceof Array ? data.key[0] : data.key;
    this.replaceClassAttrNameToId('key', data, this);
  },

  // DEPENDENCIES (using this class name)

  getDependentClasses: function () {
    return this.app.classes.filter(function (item) {
      return item !== this && (item.data.ancestor === this.id
          || item.data.refClass === this.id
          || item.data.itemsClass === this.id
          || item.data.backRef === this.id
          || item.data.backColl === this.id);
    }, this);
  },

  getDependentWorkflows: function () {
    return this.app.workflows.filter(function (item) {
      return item.data.wfClass === this.id;
    }, this);
  },

  getDependentNavItems: function () {
    let items = [];
    this.app.navSections.forEach(function (section) {
      section.getNestedItems().forEach(function (item) {
        if (item.data.classname === this.id) {
          items.push(item);
        }
      }, this);
    }, this);
    return items;
  }
});