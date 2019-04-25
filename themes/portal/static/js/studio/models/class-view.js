"use strict";

Studio.ClassViewModel = function (cls, data) {
  this.cls = cls;
  this.app = this.cls.app;
  this.clear();
  Studio.Model.call(this, 'classView:', this.app.studio, data);
};

$.extend(Studio.ClassViewModel.prototype, Studio.Model.prototype, {
  constructor: Studio.ClassViewModel,

  init: function () {
    Studio.Model.prototype.init.call(this);
    switch (this.data.name) {
      case 'list': this.initAsList(); break;
      case 'create': this.initAsCreate(); break;
      case 'item': this.initAsItem(); break;
    }
  },

  initAsList: function () {
    this.setDefaultValue('commands', [
      this.getCommandParams({
        'id': 'CREATE',
        'caption': 'Create'
      }), this.getCommandParams({
        'id': 'EDIT',
        'caption': 'Edit',
        'needSelectedItem': true
      })]);
  },

  initAsCreate: function () {
    this.setDefaultValue('commands', [
      this.getCommandParams({
        'id': 'SAVE',
        'caption': 'Create'
      }), this.getCommandParams({
        'id': 'SAVEANDCLOSE',
        'caption': 'Create and close'
      })]);
  },

  initAsItem: function () {
    this.setDefaultValue('commands', [
      this.getCommandParams({
        'id': 'SAVE',
        'caption': 'Save'
      }), this.getCommandParams({
        'id': 'SAVEANDCLOSE',
        'caption': 'Save and close'
      }), this.getCommandParams({
        'id': 'DELETE',
        'caption': 'Delete'
      })]);
  },

  getCommandParams: function (params) {
    return Object.assign({
      'id': 'ID',
      'caption': 'Caption',
      'visibilityCondition': null,
      'enableCondition': null,
      'needSelectedItem': false,
      'signBefore': false,
      'signAfter': false,
      'isBulk': false
    }, params);
  },

  isEmpty: function () {
    return !this.attrs.length && !this.groups.length;
  },

  isTabItem: function (item) {
    return this.isGroupItem(item) && item.isTab();
  },

  isGroupItem: function (item) {
    return item instanceof Studio.ClassViewGroupModel;
  },

  getItem: function (id) {
    return this.getAttr(id) || this.getGroup(id);
  },

  getItems: function () {
    return this.attrs.concat(this.groups);
  },

  getTabs: function (except) {
    return this.groups.filter(function (group) {
      return group !== except && group.isTab();
    }).sort(Studio.Model.compareByOrderNumber);
  },

  getRootItems: function () {
    return this.getNotGroupedAttrs()
      .concat(this.getNotGroupedGroups())
      .sort(Studio.Model.compareByOrderNumber);
  },

  getNotGroupedItems: function () {
    return this.getNotGroupedGroups().filter(function (group) {
      return !group.isTab();
    }).concat(this.getNotGroupedAttrs());
  },

  normalizeItemOrder: function (groupId) {
    var order = 10, step = 10;
    this.getItemsByGroupId(groupId).sort(Studio.Model.compareByOrderNumber).forEach(function (item) {
      item.setOrderNumber(order);
      order += step;
    });
  },

  getItemsByGroupId: function (groupId) {
    return this.getItems().filter(function (item) {
      return groupId ? (item.data.group === groupId) : !item.data.group;
    }, this);
  },

  remove: function () {
    this.cls.removeView(this);
  },

  clear: function () {
    this.clearAttrs();
    this.clearGroups();
  },

  // MOVING

  moveItemBefore: function (item, target) {
    if (target) {
      item.data.group = target.data.group;
      item.data.orderNumber = target.data.orderNumber - 1;
    } else {
      item.data.orderNumber = 0;
    }
    this.normalizeItemOrder(item.data.group);
  },

  moveItemAfter: function (item, target) {
    if (target) {
      item.data.group = target.data.group;
      item.data.orderNumber = target.data.orderNumber + 1;
    } else {
      item.data.orderNumber = 99999;
    }
    this.normalizeItemOrder(item.data.group);
  },

  moveItemInto: function (item, group) {
    if (this.isTabItem(item)) {
      item.data.orderNumber = group.data.orderNumber + 1;
    } else {
      item.data.group = group && group.id || null;
      item.data.orderNumber = 0;
    }
    this.normalizeItemOrder(item.data.group);
  },

  moveGroupToTab: function (group) {
    group.data.display = 'tab';
    group.data.group = null;
    group.data.orderNumber = 99999;
    this.normalizeItemOrder();
  },

  // ATTR

  getUnusedClassAttrs: function () {
    var classAttrs = this.cls.getAttrs();
    var usedAttrs = this.getClassAttrs();
    var unusedAttrs = [];
    for (var i = 0; i < classAttrs.length; ++i) {
      if (usedAttrs.indexOf(classAttrs[i]) === -1) {
        unusedAttrs.push(classAttrs[i]);
      }
    }
    return unusedAttrs;
  },

  getNotGroupedAttrs: function () {
    return this.attrs.filter(function (attr) {
      return !attr.getGroup();
    }, this);
  },

  getClassAttrs: function () {
    return Helper.Array.mapMethod('getClassAttr', this.attrs);
  },

  getAttrs: function () {
    return this.attrs;
  },

  getAttr: function (id) {
    return this.attrMap.hasOwnProperty(id) ? this.attrMap[id] : null;
  },

  getAttrByName: function (name) {
    return this.getAttrByKeyValue(name, 'name');
  },

  getAttrByKeyValue: function (value, key) {
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
    return this.createNestedModel(data, this.attrs, this.attrMap, Studio.ClassViewAttrModel);
  },

  updateByClassAttr: function (classAttr) {
    Helper.Array.eachMethod('updateByClassAttr', this.attrs, classAttr);
  },

  removeClassAttr: function (classAttr) {
    this.attrs.forEach(function (attr) {
      if (attr.getClassAttr() === classAttr) {
        this.removeAttrOnly(attr);
      }
    }, this);
  },

  removeAttr: function (model) {
    this.removeAttrOnly(model);
    this.app.studio.triggerRemoveClassViewAttr(model);
  },

  removeAttrOnly: function (model) {
    Helper.Array.removeValue(model, this.attrs);
    delete this.attrMap[model.id];
  },

  copyAttrsFrom: function (view) {
    if (view instanceof Studio.ClassViewModel) {
      view.getAttrs().forEach(function (attr) {
        this.createAttr(attr.data);
      }.bind(this));
    }
  },

  // GROUPS

  getNotGroupedGroups: function () {
    return this.groups.filter(function (attr) {
      return !attr.getGroup();
    }, this);
  },

  getDefaultGroup: function (except) {
    return this.getTabs(except)[0] || null;
  },

  getGroup: function (id) {
    return this.groupMap[id];
  },

  getGroupByName: function (name) {
    return this.getGroupByKeyValue(name, 'name');
  },

  getGroupByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.groups);
  },

  setGroupChildren: function () {
    Helper.Array.eachMethod('clearChildren', this.groups);
    this.attrs.forEach(this.setGroupChild, this);
    this.groups.forEach(this.setGroupChild, this);
    Helper.Array.eachMethod('sortChildren', this.groups);
  },

  setGroupChild: function (item) {
    var group = item.getGroup();
    if (group) {
      group.children.push(item);
    }
  },

  clearGroups: function () {
    this.groups = [];
    this.groupMap = {};
  },

  createGroups: function (items) {
    if (items instanceof Array) {
      items.forEach(this.createGroup, this);
    }
  },

  createGroup: function (data) {
    return this.createNestedModel(data, this.groups, this.groupMap, Studio.ClassViewGroupModel);
  },

  removeGroup: function (model) {
    Helper.Array.removeValue(model, this.groups);
    delete this.groupMap[model.id];
    this.setNotGroupedItemsToTab();
    this.app.studio.triggerRemoveClassViewGroup(model);
  },

  setNotGroupedItemsToTab: function () {
    var tab = this.getDefaultGroup();
    Helper.Array.eachMethod('setGroup', this.getNotGroupedItems(), tab);
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    data.properties = Helper.Array.mapMethod('exportData', this.attrs);
    data.groups = Helper.Array.mapMethod('exportData', this.groups);
    return data;
  },

  importData: function (data) {
    this.setData(data);
    this.clear();
    this.createAttrs(data && data.properties);
    this.createGroups(data && data.groups);
    delete this.data.properties;
    delete this.data.groups;
  },

  afterImport: function () {
  }
});