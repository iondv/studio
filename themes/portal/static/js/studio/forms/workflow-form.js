"use strict";

Studio.WorkflowForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.WorkflowModel, studio);
};

$.extend(Studio.WorkflowForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.WorkflowForm,

  create: function (app, defaults) {
    this.app = app;
    Studio.ModelForm.prototype.create.call(this, defaults);
  },

  update: function (model) {
    this.app = model.app;
    this.workflow = model;
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
      wfClass: [
        ['required']
      ]
    };
  },

  getUniqueModel: function (value, validator) {
    return validator.attr.form.app.getWorkflowByKeyValue(value, validator.attr.name);
  },

  getBehaviorMap: function () {
    return {
      'customHandler': {
        afterCreate: this.afterCreate.bind(this)
      }
    };
  },

  afterCreate: function (behavior) {
    this.app.updateMinorVersion();
  }
});