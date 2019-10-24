"use strict";

Studio.CheckboxFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.CheckboxFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.CheckboxFormAttr,

  getRawValue: function () {
    return this.$value.is(':checked');
  },

  setValue: function (value) {
    if (value === null || value === undefined) {
      value = this.getDefaultValue();
    }
    this.$value.prop('checked', !!value);
  }
});