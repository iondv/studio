"use strict";

Studio.CheckListFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.CheckListFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.CheckListFormAttr,

  getRawValue: function () {
    const result = [];
    this.$value.filter(':checked').each(function () {
      result.push(this.value);
    });
    return result;
  },

  setValue: function (value) {
    const values = Array.isArray(value) ? value : [];
    this.$value.each(function () {
       $(this).prop('checked', values.includes(this.value))
    });
    this.$value.first().change();
  }
});