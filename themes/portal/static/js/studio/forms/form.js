"use strict";

Studio.Form = function ($modal, studio) {
  this.studio = studio;
  this.$modal = $modal;
  this.$form = $modal.find('form');
  this.params = $modal.data('params');
  this.$cancel = $modal.find('.form-cancel');
  this.events = new Helper.Events('form:');
  this.init();
};

$.extend(Studio.Form.prototype, {

  init: function () {
    this.createAttrs();
    this.$cancel.click(this.onCancel.bind(this));
    this.$modal.on('hide.bs.modal', this.onClose.bind(this));
    this.$modal.on('hidden.bs.modal', this.onCloseAfter.bind(this));
  },

  getData: function () {
    var data = {};
    this.attrs.forEach(function (attr) {
      data[attr.name] = attr.getValue();
    });
    return data;
  },

  setData: function (data) {
    this.attrs.forEach(function (attr) {
      attr.setValue(data[attr.name]);
    });
  },

  getValue: function (attrName) {
    return this.getAttr(attrName).getValue();
  },

  getAttr: function (name) {
    return this.attrMap.hasOwnProperty(name) ? this.attrMap[name] : null;
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

  onCancel: function () {
    Studio.Behavior.execute('beforeCancel', this);
    this.events.trigger('cancel');
    this.hide();
  },

  onClose: function () {
    Studio.Behavior.execute('beforeClose', this);
    this.events.trigger('close');
  },

  onCloseAfter: function () {
    if ($('.modal:visible').length) {
      $(document.body).addClass('modal-open');
    }
  },

  show: function (defaults) {
    this.prepareAttrs();
    this.setData(defaults || {});
    Studio.Behavior.execute('beforeShow', this);
    this.$modal.modal('show');
  },

  hide: function () {
    this.$modal.modal('hide');
  },

  reset: function () {
    this.$form.find('.has-error').removeClass('has-error');
    this.$form.get(0).reset();
  },

  prepareAttrs: function () {
    Helper.Array.eachMethod('prepare', this.attrs);
  },

  jumpToError: function () {
    this.$modal.animate({
      scrollTop: this.$form.find('.has-error').first().position().top
    }, 700);
  },

  getValueLabel: function (name, value) {
    return this.attrMap[name].getValueLabel(value);
  },

  getDefaultGroupId: function () {
    var group = this.studio.getActiveClassViewGroup() || this.view.getDefaultGroup();
    return group ? group.id : null;
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