"use strict";

Studio.AppModel = function (studio, data) {
  Studio.Model.call(this, 'app:', studio, data);
};

$.extend(Studio.AppModel.prototype, Studio.Model.prototype, {
  constructor: Studio.AppModel,

  clear: function () {
    this.clearClasses();
    this.clearWorkflows();
    this.clearNavSections();
    this.clearTasks();
    this.clearInterfaces();
    this.clearChangeLogs();
    this.setChangedState(true);
  },

  getDescription: function () {
    return this.data.description;
  },

  getExternalId: function () {
    return this.data.externalId;
  },

  setExternalId: function (id) {
    this.data.externalId = id;
  },

  indexFiles: function (map) {
    Helper.Array.eachMethod('indexFiles', this.classes, map);
  },

  clearChangedState: function () {
    this.setChangedState(false);
  },

  setChangedState: function (value) {
    this.data.changedState = this.data.changedState || {};
    this.data.changedState.major = value;
    this.data.changedState.minor = value;
    this.data.changedState.patch = value;
  },

  getVersion: function () {
    return this.data.version;
  },

  updateMajorVersion: function () {
    return this.updateVersion('major');
  },

  updateMinorVersion: function () {
    return this.updateVersion('minor');
  },

  updatePatchVersion: function () {
    return this.updateVersion('patch');
  },

  updateVersion: function (type) {
    if (!this.data.changedState[type]) {
      this.data.version = Helper.Semver.addByType(type, this.data.version);
      this.data.changedState[type] = true;
      return true;
    }
  },

  remove: function () {
    this.studio.removeApp(this);
  },

  // CLASS

  getClass: function (id) {
    return this.classMap[id];
  },

  getClassByName: function (name) {
    return name ? this.getClassByKeyValue(name.split('@')[0], 'name') : null;
  },

  getClassByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.classes);
  },

  clearClasses: function () {
    this.classes = [];
    this.classMap = {};
  },

  createClasses: function (items) {
    if (items instanceof Array) {
      items.forEach(this.createClass, this);
    }
  },

  createClass: function (data) {
    return this.createNestedModel(data, this.classes, this.classMap, Studio.ClassModel);
  },

  removeClass: function (model) {
    this.removeNestedModel(model, this.classes, this.classMap);
    this.updateMajorVersion();
    this.studio.triggerRemoveClass(model);
  },

  // CLASS ATTR

  getClassAttr: function (attrId, classId) {
    let cls = this.getClass(classId);
    return cls ? cls.getOwnAttr(attrId) : null;
  },

  // CLASS LINKS

  createClassLinks: function () {
    Helper.Array.eachMethod('createLinks', this.classes);
  },

  // CLASS VIEW

  getClassView: function (viewId, classId) {
    let cls = this.getClass(classId);
    return cls ? cls.getView(viewId) : null;
  },

  // CLASS VIEW ATTR

  getClassViewAttr: function (attrId, viewId, classId) {
    let cls = this.getClass(classId);
    return cls ? cls.getViewAttr(attrId, viewId) : null;
  },

  // WORKFLOW

  getWorkflow: function (id) {
    return this.workflowMap[id];
  },

  getWorkflowByName: function (name) {
    return this.getWorkflowByKeyValue(name, 'name');
  },

  getWorkflowByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.workflows);
  },

  clearWorkflows: function () {
    this.workflows = [];
    this.workflowMap = {};
  },

  createWorkflows: function (items) {
    if (items instanceof Array) {
      items.forEach(this.createWorkflow, this);
    }
  },

  createWorkflow: function (data) {
    return this.createNestedModel(data, this.workflows, this.workflowMap, Studio.WorkflowModel);
  },

  removeWorkflow: function (model) {
    this.removeNestedModel(model, this.workflows, this.workflowMap);
    this.updateMajorVersion();
    this.studio.triggerRemoveWorkflow(model);
  },

  // WORKFLOW STATE

  getWorkflowState: function (id, workflowId) {
    let workflow = this.getWorkflow(workflowId);
    return workflow ? workflow.getState(id) : null;
  },

  // WORKFLOW TRANSITION

  getWorkflowTransition: function (id, workflowId) {
    let workflow = this.getWorkflow(workflowId);
    return workflow ? workflow.getTransition(id) : null;
  },

  // NAV SECTION

  getNavSection: function (id) {
    return this.navSectionMap[id];
  },

  getNavSectionByName: function (name) {
    return this.getNavSectionByKeyValue(name, 'name');
  },

  getNavSectionByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.navSections);
  },

  clearNavSections: function () {
    this.navSections = [];
    this.navSectionMap = {};
  },

  createNavSections: function (items) {
    if (items instanceof Array) {
      items.forEach(this.createNavSection, this);
    }
  },

  createNavSection: function (data) {
    return this.createNestedModel(data, this.navSections, this.navSectionMap, Studio.NavSectionModel);
  },

  removeNavSection: function (model) {
    this.removeNestedModel(model, this.navSections, this.navSectionMap);
    this.updateMajorVersion();
    this.studio.triggerRemoveNavSection(model);
  },

  // NAV ITEM

  getNavItem: function (id, sectionId) {
    let section = this.getNavSection(sectionId);
    return section ? section.getNestedItem(id) : null;
  },

  // TASK

  getTask: function (id) {
    return this.taskMap[id];
  },

  getTaskByCode: function (code) {
    return this.getTaskByKeyValue(code, 'code');
  },

  getTaskByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.tasks);
  },

  clearTasks: function () {
    this.tasks = [];
    this.taskMap = {};
  },

  createTasks: function (items) {
    if (items instanceof Array) {
      items.forEach(this.createTask, this);
    }
  },

  createTask: function (data) {
    return this.createNestedModel(data, this.tasks, this.taskMap, Studio.TaskModel);
  },

  removeTask: function (model) {
    this.removeNestedModel(model, this.tasks, this.taskMap);
    this.studio.triggerRemoveTask(model);
  },

  // INTERFACE

  getInterface: function (id) {
    return this.interfaceMap[id];
  },

  getInterfaceByName: function (name) {
    return this.getInterfaceByKeyValue(name, 'name');
  },

  getInterfaceByKeyValue: function (value, key) {
    return Studio.Model.getNestedModelByValue(value, key, this.interfaces);
  },

  clearInterfaces: function () {
    this.interfaces = [];
    this.interfaceMap = {};
  },

  createInterfaces: function (items) {
    if (items instanceof Array) {
      items.forEach(this.createInterface, this);
    }
  },

  createInterface: function (data) {
    return this.createNestedModel(data, this.interfaces, this.interfaceMap, Studio.InterfaceModel);
  },

  removeInterface: function (model) {
    this.removeNestedModel(model, this.interfaces, this.interfaceMap);
    this.studio.triggerRemoveInterface(model);
  },

  // CHANGE LOG

  clearChangeLogs: function () {
    this.changeLogs = [];
    this.changeLogMap = {};
  },

  createChangeLogs: function (items) {
    this.changeLogs = items instanceof Array ? items : [];
  },

  appendChangeLog: function (data) {
    data.date = (new Date).toISOString();
    this.changeLogs.push(data);
  },

  cropChangeLogs: function () {
    if (this.changeLogs.length > 150) {
      this.changeLogs = this.changeLogs.slice(0, 100);
    }
  },

  // STORE

  exportData: function () {
    let data = Object.assign({}, this.getData());
    data.classes = Helper.Array.mapMethod('exportData', this.classes);
    data.navSections = Helper.Array.mapMethod('exportData', this.navSections);
    data.workflows = Helper.Array.mapMethod('exportData', this.workflows);
    data.tasks = Helper.Array.mapMethod('exportData', this.tasks);
    data.interfaces = Helper.Array.mapMethod('exportData', this.interfaces);
    data.changeLogs = this.changeLogs;
    return data;
  },

  importData: function (data) {
    data = data || {};
    this.setData(data);
    this.clear();
    this.createClasses(data.classes);
    this.createNavSections(data.navSections);
    this.createWorkflows(data.workflows);
    this.createTasks(data.tasks);
    this.createInterfaces(data.interfaces);
    this.createChangeLogs(data.changeLogs);
    Helper.Array.eachMethod('afterImport', this.classes);
    Helper.Array.eachMethod('afterImport', this.navSections);
    Helper.Array.eachMethod('afterImport', this.workflows);
    Helper.Array.eachMethod('afterImport', this.tasks);
    Helper.Array.eachMethod('afterImport', this.interfaces);
    delete this.data.classes;
    delete this.data.navSections;
    delete this.data.workflows;
    delete this.data.tasks;
    delete this.data.interfaces;
    delete this.data.changeLogs;
  },

  afterUpload: function () {
    Helper.Array.eachMethod('afterUpload', this.navSections);
  }
});