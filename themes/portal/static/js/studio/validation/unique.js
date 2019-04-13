"use strict";

Studio.UniqueValidator = function () {
  Studio.Validator.apply(this, arguments);
};

$.extend(Studio.UniqueValidator.prototype, Studio.Validator.prototype, {
  constructor: Studio.UniqueValidator,

  getMessage () {
    return this.createMessage('Value is already in use');
  },

  validate: function (value) {
    var model = this.attr.form.model;
    var models = this.attr.form.models;
    if (models instanceof Array) {
      for (var i = 0; i < models.length; ++i) {
        var sourceValue = models[i].getValue(this.attr.name);
        if (models[i] !== model && this.isMatchValues(sourceValue, value)) {
          this.addError();
        }
      }
    }
  },

  isMatchValues: function (a, b) {
    return String(a).toLowerCase() === String(b).toLowerCase();
  }
});

// UNIQUE MODEL

Studio.UniqueModelValidator = function () {
  Studio.Validator.apply(this, arguments);
};

$.extend(Studio.UniqueModelValidator.prototype, Studio.UniqueValidator.prototype, {
  constructor: Studio.UniqueModelValidator,

  validate: function (value) {
    var model = this.params.getModel(value, this);
    if (model && model !== this.attr.form.model) {
      this.addError();
    }
  }
});