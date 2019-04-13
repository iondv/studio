"use strict";

Studio.WorkflowViewMaker = function ($container, studio) {
  Studio.ViewMaker.apply(this, arguments);
  this.modeName = 'workflowView';
  this.selectViewMessage = 'Select a state to display view';
};

$.extend(Studio.WorkflowViewMaker.prototype, Studio.ViewMaker.prototype, {
  constructor: Studio.WorkflowViewMaker,

  initStudioListeners: function () {
    var redraw = this.redraw.bind(this);
    this.studio.events.on('changeContentMode', this.onChangeContentMode.bind(this));
    this.studio.events.on('changeActiveItem', redraw);

    this.studio.events.on('selectWorkflowViewClass', redraw);
    this.studio.events.on('selectWorkflowViewState', redraw);

    this.studio.events.on('createClassViewAttr', redraw);
    this.studio.events.on('updateClassViewAttr', redraw);
    this.studio.events.on('removeClassViewAttr', redraw);

    this.studio.events.on('createClassViewGroup', redraw);
    this.studio.events.on('updateClassViewGroup', redraw);
    this.studio.events.on('removeClassViewGroup', redraw);
  },

  getActiveView: function () {
    return this.studio.toolbar.getActiveWorkflowView();
  },

  getActiveClass: function () {
    return this.studio.toolbar.getActiveWorkflowViewClass();
  },

  getActiveState: function () {
    return this.studio.toolbar.getActiveWorkflowViewState();
  },

  redraw: function (activeViewTabId) {
    if (!this.isActive()) {
      return false;
    }
    var state = this.getActiveState();
    var view = this.getActiveView();
    if (state && !view) {
      view = state.createView(this.getActiveClass());
    }
    this.view = view;
    this.draw(activeViewTabId);
  },

  onDoubleClickViewAttr: function (event) {
    this.studio.toolbar.onUpdateWorkflowViewAttr();
  },

  onDoubleClickViewGroup: function (event) {
    this.studio.toolbar.onUpdateWorkflowViewGroup();
  }
});