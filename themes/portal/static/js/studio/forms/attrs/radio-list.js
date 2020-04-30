"use strict";

Studio.RadioListFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.RadioListFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.RadioListFormAttr,

  getRawValue: function () {
    return this.$value.filter(':checked').val();
  },

  setValue: function (value) {
    this.$value.filter('[value="'+ value +'"]').prop('checked', true);
    this.triggerChange();
  }
});