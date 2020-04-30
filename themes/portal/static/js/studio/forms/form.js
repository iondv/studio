"use strict";

Studio.Form = function ($modal, studio) {
  this.studio = studio;
  this.$modal = $modal;
  this.$modal = $modal;
  this.$form = $modal.find('form');
  this.params = $modal.data('params');
  this.$cancel = $modal.find('.form-cancel');
  this.$json = $modal.find('.form-json');
  this.events = new Helper.Events('form:');
  this.data = {};
  this.init();
};

$.extend(Studio.Form.prototype, {

  init: function () {
    this.createAttrs();
    this.extension = new Studio.FormExtension(this);
    this.$cancel.click(this.onCancel.bind(this));
    this.$json.click(this.onJson.bind(this));
    this.alert = new Studio.Alert(this.$modal.find('.form-alert'));
    this.$modal.on('hide.bs.modal', this.onClose.bind(this));
    this.$modal.on('hidden.bs.modal', this.onAfterClose.bind(this));
    this.$modal.on('shown.bs.modal', this.onAfterShow.bind(this));
    this.$form.on('change', '.value', this.onChangeValue.bind(this));
  },

  getAttr: function (name) {
    return this.attrMap.hasOwnProperty(name) ? this.attrMap[name] : null;
  },

  getData: function () {
    var data = Object.assign({}, this.data);
    this.attrs.forEach(function (attr) {
      data[attr.name] = attr.getValue();
    });
    return data;
  },

  setData: function (data) {
    this.data = data;
    this.attrs.forEach(function (attr) {
      attr.setValue(data[attr.name]);
    });
  },

  getValue: function (attrName) {
    return this.getAttr(attrName).getValue();
  },

  createAttrs: function () {
    this.attrs = [];
    this.attrMap = {};
    this.$form.find('.attr').each(function (index, element) {
      var attr = Studio.FormAttr.create($(element), this);
      this.attrMap[attr.name] = attr;
      this.attrs.push(attr);
    }.bind(this));
  },

  setTitle: function (title) {
    this.$modal.find('.modal-title').html(title);
  },

  onChangeValue: function () {
    if (!this.changed) {
      this.changed = true;
      setTimeout(function () {
        this.changed = false;
        this.events.trigger('change');
      }.bind(this), 0);
    }
  },

  onChangeAttr: function (attr, event) { // from attr
  },

  onCancel: function () {
    Studio.Behavior.execute('beforeCancel', this);
    this.events.trigger('cancel');
    this.hide();
  },

  onClose: function () {
    Studio.Behavior.execute('beforeClose', this);
    this.events.trigger('close');
  },

  onAfterClose: function () {
    if ($('.modal:visible').length) {
      $(document.body).addClass('modal-open');
    }
  },

  onAfterShow: function () {
  },

  onJson: function () {
    this.studio.codeEditorForm.show(this.getJsonData(), 'json', this.setJsonData.bind(this));
  },

  getJsonData: function () {
    return this.getData();
  },

  setJsonData: function (value) {
    this.setData(JSON.parse(value));
  },

  show: function (defaults) {
    this.alert.hide();
    this.prepareAttrs();
    this.setData(defaults || {});
    Studio.Behavior.execute('beforeShow', this);
    this.events.trigger('beforeShow');
    this.$modal.modal('show');
  },

  hide: function () {
    this.$modal.modal('hide');
  },

  reset: function () {
    this.alert.hide();
    this.$form.find('.has-error').removeClass('has-error');
    this.$form.get(0).reset();
  },

  prepareAttrs: function () {
    Helper.Array.eachMethod('prepare', this.attrs);
  },

  jumpToError: function () {
    this.$modal.animate({
      'scrollTop': this.$form.find('.has-error').first().position().top
    }, 700);
  },

  getValueLabel: function (name, value) {
    return this.attrMap[name].getValueLabel(value);
  },

  getDefaultGroupId: function () {
    var group = this.studio.getActiveClassViewGroup() || this.view.getDefaultGroup();
    return group ? group.id : null;
  },

  getDefaultValue: function (name) {
    if (this._defaults && this._defaults.hasOwnProperty(name)) {
      return this._defaults[name];
    }
  },

  getDefaultValues: function () {
    var defaults = {};
    this.attrs.forEach(function (attr) {
      var value = attr.$attr.data('defaultValue');
      if (value !== undefined) {
        defaults[attr.name] = value;
      }
    });
    return defaults;
  },

  // VALIDATION

  getValidationRules: function () {
    return {};
  },

  validate: function () {
    this.clearErrors();
    var rules = this.getValidationRules();
    for (let name in rules) {
      if (rules.hasOwnProperty(name)) {
        var attr = this.getAttr(name);
        if (attr && attr.isActiveAction()) {
          rules[name].forEach(function (data) {
            Studio.Validator.create(attr, data).execute();
          }, this);
        }
      }
    }
    return !this.hasError();
  },

  clearErrors: function () {
    Helper.Array.eachMethod('clearError', this.attrs);
  },

  hasError: function () {
    var hasError = false;
    this.attrs.forEach(function (attr) {
      if (attr.hasError()) {
        hasError = true;
      }
    });
    return hasError;
  },

  // BEHAVIORS

  ensureBehaviors: function () {
    if (!(this.behaviors instanceof Array)) {
      this.behaviors = Studio.Behavior.createMultiple(this.getBehaviorMap(), this);
    }
    return this.behaviors;
  },

  getBehaviorMap: function () {
    return {
    };
  }
});