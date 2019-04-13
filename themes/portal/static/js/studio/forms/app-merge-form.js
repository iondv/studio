"use strict";

Studio.AppMergeForm = function ($modal, studio) {
  Studio.Form.call(this, $modal, studio);
};

$.extend(Studio.AppMergeForm.prototype, Studio.Form.prototype, {
  constructor: Studio.AppMergeForm,

  init: function () {
    Studio.Form.prototype.init.call(this);
    this.$classGroup = this.$form.find('[data-id="classGroup"]');
    this.$workflowGroup = this.$form.find('[data-id="workflowGroup"]');
  },

  show: function (app, data) {
    this.data = data;
    this.app = app;
    this.classDataMap = Helper.Array.indexByKey('name', data.classes);
    this.workflowDataMap = Helper.Array.indexByKey('name', data.workflows);
    this.classMap = Studio.Model.indexByName(this.app.classes);
    this.workflowMap = Studio.Model.indexByName(this.app.workflows);
    var matchedClasses = this.getMatchedModels(data.classes, this.classMap);
    var matchedWorkflows = this.getMatchedModels(data.workflows, this.workflowMap);
    this.createGroup(this.$classGroup, matchedClasses);
    this.createGroup(this.$workflowGroup, matchedWorkflows);
    matchedClasses.length || matchedWorkflows.length
      ? this.$modal.modal('show')
      : this.onClose();
  },

  onClose: function () {
    var classes = this.createModels(this.data.classes, this.createNewClass.bind(this));
    var workflows = this.createModels(this.data.workflows, this.createNewWorkflow.bind(this));
    var mergedClasses = this.mergeModels(this.$classGroup, this.classMap, this.classDataMap);
    var mergedWorkflows = this.mergeModels(this.$workflowGroup, this.workflowMap, this.workflowDataMap);
    Helper.Array.eachMethod('afterImport', classes.concat(mergedClasses, workflows, mergedWorkflows));
    this.events.trigger('close');
  },

  mergeModels: function ($group, map, dataMap) {
    return this.getMergeNames($group).map(function (name) {
      var model = map[name];
      model.importData(dataMap[name]);
      return model;
    });
  },

  getMergeNames: function ($group) {
    var names = [];
    $group.find('.value:checked').each(function () {
      names.push(this.dataset.name);
    });
    return names;
  },

  createNewClass: function (data) {
    if (!this.classMap.hasOwnProperty(data.name)) {
      return this.app.createClass(data);
    }
  },

  createNewWorkflow: function (data) {
    if (!this.workflowMap.hasOwnProperty(data.name)) {
      return this.app.createWorkflow(data);
    }
  },

  createModels: function (items, handler) {
    var models = [];
    if (items instanceof Array) {
      items.forEach(function (item) {
        var model = handler(item);
        if (model) {
          models.push(model);
        }
      }, this);
    }
    return models;
  },

  createGroup: function ($group, models) {
    $group.toggle(models.length > 0);
    var content = models.map(this.renderAttr, this).join('');
    $group.children('.fieldset-body').html(content);
  },

  renderAttr: function (model) {
    return this.studio.renderSample('merge-checkbox', {
      'name': model.getName(),
      'title': model.getFullTitle()
    });
  },

  getMatchedModels: function (items, map) {
    var models = [];
    if (items instanceof Array) {
      items.forEach(function (item) {
        if (map.hasOwnProperty(item.name)) {
          models.push(map[item.name]);
        }
      }, this);
    }
    return models;
  }
});