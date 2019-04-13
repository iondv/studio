"use strict";

Studio.Model = function (eventPrefix, studio, data) {
  this.studio = studio;
  this.oldData = {};
  this.data = data || {};
  this.events = new Helper.Events(eventPrefix);
  this.id = this.generateId();
  this.init();
};

Studio.Model.sort = function (models) {
  return models.sort(Studio.Model.compareByOrderNumber);
};

Studio.Model.compareByOrderNumber = function (a, b) {
  return a.data.orderNumber - b.data.orderNumber;
};

Studio.Model.getNestedModelByValue = function (value, key, models) {
  return models[Helper.Array.searchByNestedValue(value, 'data.'+ key, models)];
};

Studio.Model.indexByName = function (models) {
  var map = {};
  if (models instanceof Array) {
    for (var i = 0; i < models.length; ++i) {
      map[models[i].data.name] = models[i];
    }
  }
  return map;
};

$.extend(Studio.Model.prototype, {

  init: function () {
    this.importData(this.data);
  },

  generateId: function () {
    return Helper.generateId();
  },

  getId: function () {
    return this.id;
  },

  getName: function () {
    return this.data.name;
  },

  getFullName: function () {
    return this.data.name;
  },

  getTitle: function () {
    return this.data.caption === '' || this.data.caption === undefined
        ? this.getName()
        : this.data.caption;
  },

  getFullTitle: function () {
    return this.data.caption === '' || this.data.caption === undefined
        ? this.data.name
        : (this.data.caption +' ('+ this.data.name +')');
  },

  getNamespaceName: function () {
    return this.data.name + '@' + this.app.data.name;
  },

  setOrderNumber: function (value) {
    this.data.orderNumber = value;
  },

  getValue: function (attrName) {
    return this.data.hasOwnProperty(attrName) ? this.data[attrName] : undefined;
  },

  setValue: function (attrName, value) {
    this.data[attrName] = value;
  },

  setOldValue: function (attrName) {
    this.oldData[attrName] = this.data[attrName];
  },

  getData: function (key) {
    return key
        ? Helper.Object.getNestedValue(key, this.data)
        : this.data;
  },

  setData: function (data) {
    Object.assign(this.data, data);
  },

  setOldData: function () {
    Object.assign(this.oldData, this.data);
  },

  setUmlPosition: function (position) {
    this.setOptionData({
      uml: {
        offset: position
      }
    });
  },

  getChangedKeys: function () {
    return Helper.Object.diff(this.data, this.oldData);
  },

  getSelectData: function () {
    return {
      'value': this.id,
      'title': this.getName(),
      'text': this.getTitle()
    };
  },

  getOptionData: function (key) {
    return key
        ? Helper.Object.getNestedValue(key, this.data.options)
        : this.data.options;
  },

  setOptionData: function (data) {
    this.data.options = Object.assign({}, this.data.option, data);
  },

  update: function (data) {
    this.setOldData();
    this.setData(data);
  },

  clear: function () {
  },

  createNestedModel: function (data, models, modelMap, ModelClass) {
    try {
      var model = new ModelClass(this, data);
      models.push(model);
      modelMap[model.id] = model;
      return model;
    } catch (err) {
      console.error(err);
    }
  },

  removeNestedModel: function (model, models, modelMap) {
    Helper.Array.removeValue(model, models);
    delete modelMap[model.id];
  },

  // BEHAVIORS

  ensureBehaviors: function () {
    if (!(this.behaviors instanceof Array)) {
      this.behaviors = Studio.Behavior.createMultiple(this.getBehaviorMap(), this);
    }
    return this.behaviors;
  },

  getBehaviorMap: function () {
    return {};
  },

  // STORE

  exportData: function () {
    return this.getData();
  },

  importData: function (data) {
    this.setData(data);
  },

  afterImport: function () {
  },

  normalizeExportData: function (data) {
    return data;
  },

  normalizeImportData: function (data) {
    return data;
  },

  replaceIdToClassName: function (key, data) {
    this.replaceIdToModelName(key, data, this.app.getClass);
  },

  replaceClassNameToId: function (key, data) {
    this.replaceModelNameToId(key, data, this.app.getClassByName);
  },

  replaceIdToClassAttrName: function (key, data, cls) {
    this.replaceIdToModelName(key, data, cls.getOwnAttr.bind(cls));
  },

  replaceClassAttrNameToId: function (key, data, cls) {
    this.replaceModelNameToId(key, data, cls.getOwnAttrByName.bind(cls));
  },

  replaceIdToInterface: function (key, data) {
    this.replaceIdToModelName(key, data, this.app.getInterface);
  },

  replaceInterfaceToId: function (key, data) {
    this.replaceModelNameToId(key, data, this.app.getInterfaceByName);
  },

  replaceIdToModelName: function (key, data, modelGetter) {
    this.replaceModelValue(key, data, modelGetter, 'getName');
  },

  replaceModelNameToId: function (key, data, modelGetter) {
    this.replaceModelValue(key, data, modelGetter, 'getId');
  },

  replaceModelValue: function (key, data, modelGetter, valueMethod) {
    if (data.hasOwnProperty(key)) {
      let model = modelGetter.call(this.app, data[key]);
      data[key] = model ? model[valueMethod]() : '';
    }
  }
});