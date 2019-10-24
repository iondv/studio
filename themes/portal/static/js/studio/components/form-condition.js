'use strict';

Studio.FormConditionOperators = {
  'AND': 'validateAnd',
  'OR': 'validateOr',
  '=': 'validateEqual',
  '!=': 'validateNotEqual'
};

Studio.FormCondition = function (data, form) {
  this.form = form;
  this.data = data;
};

$.extend(Studio.FormCondition.prototype, {

  isValid: function () {
    return this.validate(this.data);
  },

  getValue (name) {
    switch (name) {
      case '$create': return this.form.isNew();
      case '$update': return !this.form.isNew();
    }
    let attr = this.form.getAttr(name);
    if (attr) {
      return attr.getValue();
    }
    console.error('Not found attribute', name);
  },

  validate: function (data) {
    if (!Array.isArray(data)) {
      return this.validateHash(data);
    }
    let op = data[0];
    if (op && typeof op === 'object') {
      op = 'AND';
    } else {
      data = data.slice(1)
    }
    return Studio.FormConditionOperators.hasOwnProperty(op)
      ? this[Studio.FormConditionOperators[op]](op, data)
      : console.error('Not found operator', op);
  },

  validateHash: function (data) {
    for (let name of Object.keys(data)) {
      let value = this.getValue(name);
      if (Array.isArray(data[name])) {
        if (!data[name].includes(value)) {
          return false;
        }
      } else if (data[name] !== value) {
        return false;
      }
    }
    return true;
  },

  validateAnd: function (op, items) {
    if (items.length === 0) {
      return this.logError(op, items);
    }
    for (let item of items) {
      if (!this.validate(item)) {
        return false;
      }
    }
    return true;
  },

  validateOr: function (op, items) {
    if (items.length === 0) {
      return this.logError(op, items);
    }
    for (let item of items) {
      if (this.validate(item)) {
        return true;
      }
    }
    return false;
  },

  validateEqual: function (op, items) {
    return items.length !== 2 ? this.logError(op, items) : items[1] === this.getValue(items[0]);
  },

  validateNotEqual: function (op, items) {
    return !this.validateEqual(op, items);
  },

  logError: function (op, items) {
    console.error(op, 'Operands invalid', JSON.stringify(items));
  }
});