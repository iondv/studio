"use strict";

Studio.WorkflowStateModel = function (workflow, data) {
  this.app = workflow.app;
  this.workflow = workflow;
  this.clear();
  Studio.Model.call(this, 'workflowState:', this.app.studio, data);
};

$.extend(Studio.WorkflowStateModel.prototype, Studio.Model.prototype, {
  constructor: Studio.WorkflowStateModel,

  isStartState: function () {
    return this.workflow.getStartState() === this;
  },

  getStartTransitions: function () {
    return this.workflow.transitions.filter(function (transition) {
      return transition.getStartState() === this;
    }, this);
  },

  getTransitions: function () {
    return this.workflow.transitions.filter(function (transition) {
      return transition.getStartState() === this || transition.getFinishState() === this;
    }, this);
  },

  remove: function () {
    this.workflow.removeState(this);
  },

  clear: function () {
    this.clearViews();
  },

  // VIEW

  isEmptyViews: function () {
    return this.views.filter(function (view) {
      return !view.isEmpty();
    }, this).length === 0;
  },

  hasView: function (target) {
    for (let view of this.views) {
      if (view === target) {
        return true;
      }
    }
  },

  getView: function (cls) {
    cls = cls instanceof Studio.ClassModel ? cls.id : cls;
    return this.viewMap[cls] instanceof Studio.ClassViewModel ? this.viewMap[cls] : null;
  },

  clearViews: function () {
    this.views = [];
    this.viewMap = {}; // by class id
  },

  createViews: function (items) {
    if (items instanceof Array) {
      items.forEach(function (data) {
        var cls = this.app.getClassByName(data.name);
        cls && this.createView(cls, data);
      }, this);
    }
  },

  createView: function (cls, data) {
    data = data || {};
    data.name = cls.id;
    var view = new Studio.ClassViewModel(cls, data);
    this.views.push(view);
    return this.viewMap[cls.id] = view;
  },

  removeView: function (model) {
    Helper.Array.removeValue(model, this.views);
    delete this.viewMap[model.name];
    this.app.studio.triggerRemoveWorkflowView(model);
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    data.views = Helper.Array.mapMethod('exportData', this.views);
    return this.normalizeExportData(data);
  },

  normalizeExportData: function (data) {
    if (data) {
      this.normalizeViewExportData(data.views);
    }
    return data;
  },

  normalizeViewExportData: function (items) {
    if (items instanceof Array) {
      items.forEach(function (item) {
        item.name = this.app.getClass(item.name).getName();
      }, this);
    }
  },

  importData: function (data) {
    data = data || {};
    this.setData(data);
    this.clear();
    this.createViews(data.views);
    delete this.data.views;
  }
});