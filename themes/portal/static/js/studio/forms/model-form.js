"use strict";

Studio.ModelForm = function ($modal, Model, studio) {
  this.Model = Model;
  Studio.Form.call(this, $modal, studio);
};

$.extend(Studio.ModelForm.prototype, Studio.Form.prototype, {
  constructor: Studio.ModelForm,

  init: function () {
    Studio.Form.prototype.init.call(this);
    this.$create = this.$modal.find('.form-create');
    this.$update = this.$modal.find('.form-update');
    this.$create.click(this.onCreate.bind(this));
    this.$update.click(this.onUpdate.bind(this));
  },

  isNew: function () {
    return this.model === null;
  },

  isAttrChanged: function (name) {
    return this.model && !Helper.matchAsStrings(this.model.getValue(name), this.getValue(name));
  },

  getCreateTitle: function () {
    return Helper.L10n.translate(this.params.createTitle || 'Create');
  },

  getUpdateTitle: function () {
    return Helper.L10n.translate(this.params.updateTitle || 'Update');
  },

  getData: function () {
    var data = Studio.Form.prototype.getData.call(this);
    return this.isNew() ? this.getDataOnCreate(data) : this.getDataOnUpdate(data);
  },

  getDataOnCreate: function (data) {
    return data;
  },

  getDataOnUpdate: function (data) {
    return data;
  },

  create: function (defaults) {
    this.model = null;
    this.reset();
    this.$update.hide();
    this.$create.show();
    this.setTitle(this.getCreateTitle());
    this.prepareAttrs();
    this.setData(defaults || {});
    Studio.Behavior.execute('beforeCreate', this);
    Studio.Behavior.execute('beforeShow', this);
    this.$modal.modal('show');
  },

  createHidden: function (defaults) {
    this.model = null;
    this.reset();
    this.prepareAttrs();
    this.setData(defaults || {});
    Studio.Behavior.execute('beforeCreate', this);
    Studio.Behavior.execute('afterCreate', this);
  },

  update: function (model) {
    this.model = model;
    this.reset();
    this.$update.show();
    this.$create.hide();
    this.setTitle(this.getUpdateTitle());
    this.prepareAttrs();
    this.setData(model.getData());
    Studio.Behavior.execute('beforeUpdate', this);
    Studio.Behavior.execute('beforeShow', this);
    this.$modal.modal('show');
  },

  onCreate: function () {
    if (!this.validate()) {
      return this.jumpToError();
    }
    Studio.Behavior.execute('afterCreate', this);
    this.triggerCreate();
    this.hide();
  },

  onUpdate: function () {
    if (!this.validate()) {
      return this.jumpToError();
    }
    Studio.Behavior.execute('afterUpdate', this);
    this.model.update(this.getData());
    this.triggerUpdate();
    this.hide();
  },

  triggerCreate: function () {
    this.events.trigger('create', this.getData());
  },

  triggerUpdate: function () {
    this.events.trigger('update', this.model);
  }
});