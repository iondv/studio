"use strict";

Studio.ClassForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.ClassModel, studio);
};

$.extend(Studio.ClassForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.ClassForm,

  create: function (app, defaults) {
    this.cls = null;
    this.app = app;
    Studio.ModelForm.prototype.create.call(this, defaults);
  },

  update: function (model) {
    this.cls = model;
    this.app = this.cls.app;
    Studio.ModelForm.prototype.update.apply(this, arguments);
  },

  getValidationRules: function () {
    return {
      name: [
        ['required'],
        ['identifier'],
        ['uniqueModel', {
          getModel: this.getUniqueModel
        }]
      ],
      caption: [
        ['required'],
        ['uniqueModel', {
          getModel: this.getUniqueModel
        }]
      ],
      key: [
        ['required']
      ],
    };
  },

  getUniqueModel: function (value, validator) {
    return validator.attr.form.app.getClassByKeyValue(value, validator.attr.name);
  },

  getBehaviorMap: function () {
    return {
      'customHandler': {
        afterCreate: this.afterCreate.bind(this),
        afterUpdate: this.afterUpdate.bind(this)
      }
    };
  },

  afterCreate: function (behavior) {
    this.app.updateMinorVersion();
  },

  afterUpdate: function (behavior) {
    if (this.isAttrChanged('name')) {
      this.app.updatePatchVersion();
    }
  }
});