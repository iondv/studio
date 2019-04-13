"use strict";

Studio.WorkflowTransitionForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.WorkflowTransitionModel, studio);
};

$.extend(Studio.WorkflowTransitionForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.WorkflowTransitionForm,

  create: function (startState, finishState, defaults) {
    this.app = startState.workflow.app;
    this.workflow = startState.workflow;
    this.state = startState;
    Studio.ModelForm.prototype.create.call(this, $.extend({
      'startState': startState.id,
      'finishState': finishState && finishState.id
    }, defaults));
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
      startState: [
        ['required']
      ],
      finishState: [
        ['required']
      ],
      assignments: [
          ['json']
      ],
      conditions: [
        ['json']
      ],
      roles: [
        ['json']
      ]
    };
  },

  getUniqueModel: function (value, validator) {
    return validator.attr.form.workflow.getTransitionByKeyValue(value, validator.attr.name);
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