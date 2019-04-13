"use strict";

Studio.WorkflowTransitionModel = function (workflow, data) {
  this.app = workflow.app;
  this.workflow = workflow;
  Studio.Model.call(this, 'workflowState:', this.app.studio, data);
};

$.extend(Studio.WorkflowTransitionModel.prototype, Studio.Model.prototype, {
  constructor: Studio.WorkflowTransitionModel,

  hasStates: function (start, end) {
    return this.data.startState === start && this.data.finishState === end;
  },

  getStartState: function () {
    return this.workflow.getState(this.data.startState);
  },

  getFinishState: function () {
    return this.workflow.getState(this.data.finishState);
  },

  hasCondition: function () {
    return this.data.conditions && this.data.conditions.length > 0;
  },

  hasAssignment: function () {
    return this.data.assignments && this.data.assignments.length > 0;
  },

  remove: function () {
    this.workflow.removeTransition(this);
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    this.normalizeExportData(data);
    return data;
  },

  normalizeExportData: function (data) {
    if (data) {
      this.workflow.replaceIdToStateName('startState', data);
      this.workflow.replaceIdToStateName('finishState', data);
    }
    return data;
  },

  afterImport: function () {
    this.normalizeImportData(this.data);
  },

  normalizeImportData: function (data) {
    if (data) {
      this.workflow.replaceStateNameToId('startState', data);
      this.workflow.replaceStateNameToId('finishState', data);
    }
    return data;
  }
});