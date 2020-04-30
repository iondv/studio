"use strict";

Studio.CodeFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.CodeFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.CodeFormAttr,

  init: function () {
    this.mode = this.$attr.data('mode');
    this.$value.click(this.onClickValue.bind(this));
  },

  onClickValue: function () {
    this.$value.blur();
    this.form.studio.codeEditorForm.show(this.getValue(), this.mode, this.afterSave.bind(this));
  },

  afterSave: function (value) {
    this.setValue(value);
  }
});

Studio.JsonFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.JsonFormAttr.prototype, Studio.CodeFormAttr.prototype, {
  constructor: Studio.JsonFormAttr,

  init: function () {
    Studio.CodeFormAttr.prototype.init.call(this);
    this.mode = 'json';
  },

  getValue: function () {
    return Helper.parseJson(this.$value.val());
  },

  getDefaultValue: function () {
    let value = this.$attr.data('defaultValue');
    return value === undefined ? null : value;
  },

  setValue: function (value) {
    if (value === undefined) {
      value = this.getDefaultValue();
    } else if (typeof value === 'string') {
      value = Helper.parseJson(value);
    }
    this.$value.val(Helper.stringifyJson(value));
    this.triggerChange();
  }
});