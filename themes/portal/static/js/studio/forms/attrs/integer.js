"use strict";

Studio.IntegerFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.IntegerFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.IntegerFormAttr,

  init () {
    Studio.FormAttr.prototype.init.call(this);
  },

  getRawValue: function () {
    var value = this.$value.val();
    if (value === '') {
      return null;
    }
    value = Math.round(value);
    return isNaN(value) ? null : value;
  },

  setValue: function (value) {
    if (value !== null && value !== undefined) {
      value = Math.round(value);
      value = isNaN(value) ? '' : value;
    }
    Studio.FormAttr.prototype.setValue.call(this, value);
  },

});