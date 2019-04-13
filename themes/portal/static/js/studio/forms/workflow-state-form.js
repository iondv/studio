"use strict";

Studio.WorkflowStateForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.WorkflowStateModel, studio);
};

$.extend(Studio.WorkflowStateForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.WorkflowStateForm,

  create: function (workflow, defaults) {
    this.app = workflow.app;
    this.workflow = workflow;
    Studio.ModelForm.prototype.create.call(this, defaults);
  },

  update: function (model) {
    this.app = model.app;
    this.workflow = model.workflow;
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
      conditions: [
          ['json']
      ],
      itemPermissions: [
        ['json']
      ],
      propertyPermissions: [
        ['json']
      ],
      selectionProviders: [
        ['json']
      ]
    };
  },

  getUniqueModel: function (value, validator) {
    return validator.attr.form.workflow.getStateByKeyValue(value, validator.attr.name);
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