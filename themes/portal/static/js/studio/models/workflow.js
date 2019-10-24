"use strict";

Studio.WorkflowModel = function (app, data) {
  this.app = app;
  this.clear();
  Studio.Model.call(this, 'workflow:', app.studio, data);
};

$.extend(Studio.WorkflowModel.prototype, Studio.Model.prototype, {
  constructor: Studio.WorkflowModel,

  getClass: function () {
    return this.app.getClass(this.data.wfClass);
  },

  getItem: function (id) {
    return this.getState(id) || this.getTransition(id);
  },

  clear: function () {
    this.clearStates();
    this.clearTransitions();
  },

  remove: function () {
    this.app.removeWorkflow(this);
  },

  clone: function () {
    var data = $.extend(true, {}, this.exportData());
    data.name = 'clone-'+ data.name;
    data.caption = 'clone-'+ data.caption;
    var model = this.app.createWorkflow(data);
    model.afterImport();
    return model;
  },

  // STATES

  setSingleStateAsStart: function () {
    if (this.states.length === 1) {
      this.data.startState = this.states[0].id;
    }
  },

  getStartState: function () {
    return this.stateMap[this.data.startState];
  },

  getState: function (id) {
    return this.stateMap.hasOwnProperty(id) ? this.stateMap[id] : null;
  },

  getStateByName: function (name) {
    return this.getStateByKeyValue(name, 'name');
  },

  getStateByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.states);
  },

  getStateByView: function (view) {
    for (let state of this.states) {
      if (state.hasView(view)) {
        return state;
      }
    }
  },

  clearStates: function () {
    this.states = [];
    this.stateMap = {};
  },

  createStates: function (items) {
    if (items instanceof Array) {
      items.forEach(this.createState, this);
    }
  },

  createState: function (data) {
    return this.createNestedModel(data, this.states, this.stateMap, Studio.WorkflowStateModel);
  },

  removeState: function (model) {
    this.removeStateTransitions(model);
    Helper.Array.removeValue(model, this.states);
    delete this.stateMap[model.id];
    this.app.updateMajorVersion();
    this.studio.triggerRemoveWorkflowState(model);
  },

  // TRANSITIONS

  getTransition: function (id) {
    return this.transitionMap.hasOwnProperty(id) ? this.transitionMap[id] : null;
  },

  getTransitionByName: function (name) {
    return this.getTransitionByKeyValue(name, 'name');
  },

  getTransitionByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.transitions);
  },

  getTransitionByStates: function (state1, state2) {
    return this.transitions.filter(function (model) {
      return model.hasStates(state1, state2);
    }, this)[0];
  },

  clearTransitions: function () {
    this.transitions = [];
    this.transitionMap = {};
  },

  createTransitions: function (items) {
    if (items instanceof Array) {
      items.forEach(this.createTransition, this);
    }
  },

  createTransition: function (data) {
    return this.createNestedModel(data, this.transitions, this.transitionMap, Studio.WorkflowTransitionModel);
  },

  removeTransition: function (model) {
    this.removeTransitionInternal(model);
    this.app.updateMajorVersion();
    this.studio.triggerRemoveWorkflowTransition(model);
  },

  removeStateTransitions: function (state) {
    state.getTransitions().forEach(function (model) {
      this.removeTransitionInternal(model);
    }, this);
  },

  removeTransitionInternal: function (model) {
    Helper.Array.removeValue(model, this.transitions);
    delete this.transitionMap[model.id];
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    data.states = Helper.Array.mapMethod('exportData', this.states);
    data.transitions = Helper.Array.mapMethod('exportData', this.transitions);
    this.normalizeExportData(data);
    return data;
  },

  normalizeExportData: function (data) {
    if (data) {
      this.replaceIdToClassName('wfClass', data);
      this.replaceIdToStateName('startState', data);
    }
    return data;
  },

  importData: function (data) {
    data = data || {};
    this.setData(data);
    this.clear();
    this.createStates(data.states);
    this.createTransitions(data.transitions);
    delete this.data.states;
    delete this.data.transitions;
  },

  afterImport: function () {
    this.normalizeImportData(this.data);
    Helper.Array.eachMethod('afterImport', this.states);
    Helper.Array.eachMethod('afterImport', this.transitions);
  },

  normalizeImportData: function (data) {
    if (data) {
      this.replaceClassNameToId('wfClass', data);
      this.replaceStateNameToId('startState', data);
    }
    return data;
  },

  replaceIdToStateName: function (key, data) {
    if (data.hasOwnProperty(key)) {
      let model = this.getState(data[key]);
      data[key] = model ? model.getName() : '';
    }
  },

  replaceStateNameToId: function (key, data) {
    if (data.hasOwnProperty(key)) {
      let model = this.getStateByName(data[key]);
      data[key] = model ? model.id : '';
    }
  }
});