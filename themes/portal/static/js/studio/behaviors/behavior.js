"use strict";

Studio.Behavior = function (data, owner) {
  this.data = data;
  this.owner = owner;
  this.handlers = {};
};

Studio.Behavior.createMultiple = function (data, owner) {
  return Object.keys(data).map(function (name) {
    var type = data[name].type || name;
    return Studio.Behavior.create(type, data[name], owner);
  });
};

Studio.Behavior.create = function (type, data, owner) {
  var Behavior = null;
  switch (type) {
    case 'customHandler': Behavior = Studio.CustomHandlerBehavior; break;
    case 'clearFileStore': Behavior = Studio.ClearFileStoreBehavior; break;
    case 'modelOrderNumber': Behavior = Studio.ModelOrderNumberBehavior; break;
    case 'updateAppVersion': Behavior = Studio.UpdateAppVersionBehavior; break;

  }
  if (!Behavior) {
    throw new Error('Not found behavior type: '+ data.type);
  }
  return new Behavior(data, owner);
};

Studio.Behavior.execute = function (event, owner) {
  owner.ensureBehaviors().forEach(function (behavior) {
    behavior._execute(event);
  });
};

$.extend(Studio.Behavior.prototype, {

  getHandler: function (event) {
    return this.handlers.hasOwnProperty(event) ? this.handlers[event] : null;
  },

  _execute: function (event) {
    var handler = this.getHandler(event);
    if (handler) {
      handler.call(this, this);
    }
  }
});

// CUSTOM HANDLER

Studio.CustomHandlerBehavior = function (data, owner) {
  Studio.Behavior.call(this, null, owner);
  for (var eventName in data) {
    if (data.hasOwnProperty(eventName) && typeof data[eventName] === 'function') {
      this.handlers[eventName] = data[eventName];
    }
  }
};

$.extend(Studio.CustomHandlerBehavior.prototype, Studio.Behavior.prototype, {
  constructor: Studio.CustomHandlerBehavior,
});

// CLEAR FILE STORE

Studio.ClearFileStoreBehavior = function (data, owner) {
  Studio.Behavior.call(this, $.extend({
  }, data), owner);
  this.handlers.beforeClose = this.beforeClose;
};

$.extend(Studio.ClearFileStoreBehavior.prototype, Studio.Behavior.prototype, {
  constructor: Studio.ClearFileStoreBehavior,

  beforeClose: function () {
    //console.log('before close');
  }
});

// MODEL ORDER NUMVER

Studio.ModelOrderNumberBehavior = function (data, owner) {
  Studio.Behavior.call(this, $.extend({
    propName: 'orderNumber',
    orderStep: 10,
    getModels: function (behavior) {
      return [];
    }
  }, data), owner);
  this.handlers.beforeCreate = this.beforeCreate;
};

$.extend(Studio.ModelOrderNumberBehavior.prototype, Studio.Behavior.prototype, {
  constructor: Studio.ModelOrderNumberBehavior,

  beforeCreate: function () {
    var value = this.getMaxValue(this.data.propName);
    var attr = this.owner.getAttr(this.data.propName);
    attr.setValue(value + this.data.orderStep);
  },

  getMaxValue: function (propName) {
    var max = 0;
    this.data.getModels(this).forEach(function (model) {
      var value = parseInt(model.getValue(propName));
      if (value > max) {
        max = value;
      }
    });
    return max;
  }
});

// UPDATE APP VERSION

Studio.UpdateAppVersionBehavior = function (data, owner) {
  Studio.Behavior.call(this, $.extend({
    // type: ''
  }, data), owner);
  this.handlers.afterCreate = this.afterCreate;
};

$.extend(Studio.UpdateAppVersionBehavior.prototype, Studio.Behavior.prototype, {
  constructor: Studio.UpdateAppVersionBehavior,

  afterCreate: function () {
    this.owner.app.updateVersion(this.data.type);
  }
});