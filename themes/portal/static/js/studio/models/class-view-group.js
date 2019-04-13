"use strict";

Studio.ClassViewGroupModel = function (view, data) {
  this.view = view;
  this.cls = view.cls;
  this.app = view.app;
  Studio.Model.call(this, 'classViewGroup:', this.app.studio, data);
};

$.extend(Studio.ClassViewGroupModel.prototype, Studio.Model.prototype, {
  constructor: Studio.ClassViewGroupModel,

  isTab: function () {
    return this.data.display === 'tab' && !this.data.group;
  },

  isAncestorFor: function (child) {
    child = child instanceof Studio.ClassViewGroupModel
      ? child
      : this.view.getGroup(child);
    return child ? child.hasAncestor(this) : false;
  },

  hasAncestor: function (ancestor) {
    var parent = this.getGroup();
    return parent && ancestor && parent === ancestor
      ? true
      : parent ? parent.hasAncestor(ancestor) : false;
  },

  generateId: function () {
    return this.data.name || Helper.generateId();
  },

  getTitle: function () {
    return this.data.caption;
  },

  getGroup: function () {
    return this.view.getGroup(this.data.group);
  },

  setGroup: function (group) {
    this.data.group = group ? group.id : null;
  },

  setData: function (data) {
    Object.assign(this.data, data);
    if (!this.data.name) {
      this.data.name = this.id;
    }
  },

  remove: function () {
    this.view.removeGroup(this);
  },

  // CHILDREN

  clearChildren: function () {
    this.children = [];
  },

  setChild: function (item) {
    if (item.data.group === this.id) {
      this.children.push(item);
    }
  },

  sortChildren: function (item) {
    this.children.sort(Studio.Model.compareByOrderNumber);
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    return data;
  },

  afterImport: function () {
  }

});