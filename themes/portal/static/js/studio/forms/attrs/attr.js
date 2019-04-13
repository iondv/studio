"use strict";

Studio.FormAttr = function ($attr, form) {
  this.form = form;
  this.$attr = $attr;
  this.$value = $attr.find('.value');
  this.name = $attr.data('name');
  this.action = $attr.data('action');
  this.params = $attr.data('params') || {};
  this.init();
};

Studio.FormAttr.create = function ($attr, form) {
  var Attr = Studio.FormAttr;
  switch ($attr.data('type')) {
    case 'checkbox': Attr = Studio.CheckboxFormAttr; break;
    case 'code': Attr = Studio.CodeFormAttr; break;
    case 'dateTime': Attr = Studio.DateTimeFormAttr; break;
    case 'file': Attr = Studio.FileFormAttr; break;
    case 'integer': Attr = Studio.IntegerFormAttr; break;
    case 'json': Attr = Studio.JsonFormAttr; break;
    case 'radioList': Attr = Studio.RadioListFormAttr; break;
    case 'selectClass': Attr = Studio.SelectClassFormAttr; break;
    case 'selectClassAttr': Attr = Studio.SelectClassAttrFormAttr; break;
    case 'selectGroup': Attr = Studio.SelectGroupFormAttr; break;
    case 'selectInterface': Attr = Studio.SelectInterfaceFormAttr; break;
    case 'selectWorkflow': Attr = Studio.SelectWorkflowFormAttr; break;
    case 'selectWorkflowState': Attr = Studio.SelectWorkflowStateFormAttr; break;
    case 'selectExternalService': Attr = Studio.SelectExternalServiceFormAttr; break;
  }
  return new Attr($attr, form);
};

$.extend(Studio.FormAttr.prototype, {

  init: function () {
  },

  prepare: function () {
    this.setMask();
    this.$attr.toggle(this.isActiveAction());
  },

  isActiveAction: function () {
    return !this.action
      || (this.action === 'create' && this.form.isNew())
      || (this.action === 'update' && !this.form.isNew());
  },

  disable: function () {
    this.$value.attr('disabled', true);
    this.$attr.addClass('disabled');
  },

  setMask: function () {
    var mask = this.$attr.data('mask');
    if (mask) {
      this.$value.inputmask(mask);
    }
  },

  clearValue: function () {
    this.$value.val('').change();
  },

  getRawValue: function () {
    return this.$value.val();
  },

  getValue: function () {
    return this.getRawValue();
  },

  setValue: function (value) {
    if (value === null || value === undefined) {
      value = this.getDefaultValue();
    }
    this.$value.val(value).change();
  },

  getDefaultValue: function () {
    var value = this.$attr.data('defaultValue');
    return value === null || value === undefined ? '' : value;
  },

  hasError: function () {
    return this.$attr.hasClass('has-error');
  },

  clearError: function () {
    this.$attr.removeClass('has-error');
  },

  addError: function (message) {
    this.$attr.addClass('has-error');
    this.$attr.find('.error-block').html(message);
  },

  getValueLabel: function (value) {
    return this.$value.find('[value="'+ value +'"]').html();
  },

  toggle: function (state) {
    this.$attr.toggle(state);
  }
});
