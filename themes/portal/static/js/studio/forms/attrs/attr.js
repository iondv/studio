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
  let Attr = Studio.FormAttr;
  switch ($attr.data('type')) {
    case 'checkbox': Attr = Studio.CheckboxFormAttr; break;
    case 'checkList': Attr = Studio.CheckListFormAttr; break;
    case 'code': Attr = Studio.CodeFormAttr; break;
    case 'commands': Attr = Studio.CommandsFormAttr; break;
    case 'condition': Attr = Studio.ConditionFormAttr; break;
    case 'dateTime': Attr = Studio.DateTimeFormAttr; break;
    case 'deployRestAuthMode': Attr = Studio.DeployRestAuthModeFormAttr; break;
    case 'entry': Attr = Studio.EntryFormAttr; break;
    case 'selectionEntry': Attr = Studio.SelectionEntryFormAttr; break;
    case 'file': Attr = Studio.FileFormAttr; break;
    case 'integer': Attr = Studio.IntegerFormAttr; break;
    case 'json': Attr = Studio.JsonFormAttr; break;
    case 'radioList': Attr = Studio.RadioListFormAttr; break;
    case 'selectClass': Attr = Studio.SelectClassFormAttr; break;
    case 'selectClassAttr': Attr = Studio.SelectClassAttrFormAttr; break;
    case 'selectGroup': Attr = Studio.SelectGroupFormAttr; break;
    case 'selectNavSection': Attr = Studio.SelectNavSectionFormAttr; break;
    case 'selectNavItem': Attr = Studio.SelectNavItemFormAttr; break;
    case 'selectInterface': Attr = Studio.SelectInterfaceFormAttr; break;
    case 'selectWorkflow': Attr = Studio.SelectWorkflowFormAttr; break;
    case 'selectWorkflowState': Attr = Studio.SelectWorkflowStateFormAttr; break;
    case 'selectExternalService': Attr = Studio.SelectExternalServiceFormAttr; break;
    case 'selectHandler': Attr = Studio.SelectHandlerFormAttr; break;
    case 'static': Attr = Studio.StaticFormAttr; break;
  }
  return new Attr($attr, form);
};

$.extend(Studio.FormAttr.prototype, {

  init: function () {
    this.$value.change(this.onChange.bind(this));
  },

  isDisabled: function () {
    return this.$attr.hasClass('disabled');
  },

  isHidden: function () {
    return this.$attr.hasClass('hidden');
  },

  getType: function () {
    return this.$attr.data('type');
  },

  onChange: function (event) {
    this.form.onChangeAttr(this, event);
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

  disable: function (state) {
    if (state) {
      this.$value.attr('disabled', true);
      this.$attr.addClass('disabled');
    } else {
      this.$value.removeAttr('disabled');
      this.$attr.removeClass('disabled');
    }
  },

  setMask: function () {
    const mask = this.$attr.data('mask');
    if (mask) {
      this.$value.inputmask(mask);
    }
  },

  clearValue: function () {
    this.$value.val('');
    this.triggerChange();
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
    this.$value.val(value);
    this.triggerChange();
  },

  getDefaultValue: function () {
    const value = this.$attr.data('defaultValue');
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
  },

  triggerChange: function () {
    this.$value.first().change();
  },

  setTargetAttr: function () {
    let target = this.form.getAttr(this.$attr.data('targetAttr'));
    if (target) {
      let value = this.getRawValue();
      if (value) {
        target.setValue(value);
      }
    }
  }
});

/* SELECT HANDLER */

Studio.SelectHandlerFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.SelectHandlerFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.SelectHandlerFormAttr,

  prepare: function () {
    this.$value.html(Helper.Html.createSelectItems({
      'items': this.form.getSelectItems(this.name)
    }));
  }
});

/* STATIC */

Studio.StaticFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.StaticFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.StaticFormAttr,

  setValue: function () {
    Studio.FormAttr.prototype.setValue.apply(this, arguments);
    this.$attr.find('.value-label').html(this.getValue());
  }
});