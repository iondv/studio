"use strict";

Studio.Standalone = function (studio, data) {
  this.studio = studio;
  this.data = data;
  this.api = data.api;
  this.changedItems = [];
};

$.extend(Studio.Standalone.prototype, {

  isActive: function () {
    return !!this.data;
  },

  initListeners: function () {
    if (this.isActive()) {
      this.studio.events.on('changeContentMode', this.onChangeContentMode.bind(this));

      this.studio.classUml.events.on('dragEnd', this.onUpdateStudio.bind(this));
      this.studio.workflowUml.events.on('dragEnd', this.onUpdateStudio.bind(this));
      this.studio.viewMaker.events.on('dragEnd', this.onUpdateClassView.bind(this));
      this.studio.workflowViewMaker.events.on('dragEnd', this.onUpdateWorkflowView.bind(this));

      this.studio.events.on('updateApp', this.onUpdateApp.bind(this));
      this.studio.events.on('removeApp', this.onRemoveApp.bind(this));

      this.studio.events.on('createClass', this.onUpdateClass.bind(this));
      this.studio.events.on('updateClass', this.onUpdateClass.bind(this));
      this.studio.events.on('removeClass', this.onRemoveClass.bind(this));

      this.studio.events.on('createClassAttr', this.onUpdateClassAttr.bind(this));
      this.studio.events.on('updateClassAttr', this.onUpdateClassAttr.bind(this));
      this.studio.events.on('removeClassAttr', this.onUpdateClassAttr.bind(this));

      this.studio.events.on('createClassView', this.onUpdateClassView.bind(this));
      this.studio.events.on('updateClassView', this.onUpdateClassView.bind(this));
      this.studio.events.on('removeClassView', this.onRemoveClassView.bind(this));

      this.studio.events.on('createClassViewAttr', this.onUpdateClassViewAttr.bind(this));
      this.studio.events.on('updateClassViewAttr', this.onUpdateClassViewAttr.bind(this));
      this.studio.events.on('removeClassViewAttr', this.onUpdateClassViewAttr.bind(this));

      this.studio.events.on('createClassViewGroup', this.onUpdateClassViewGroup.bind(this));
      this.studio.events.on('updateClassViewGroup', this.onUpdateClassViewGroup.bind(this));
      this.studio.events.on('removeClassViewGroup', this.onUpdateClassViewGroup.bind(this));

      this.studio.events.on('createClassPrintView', this.onUpdateClassPrintView.bind(this));
      this.studio.events.on('updateClassPrintView', this.onUpdateClassPrintView.bind(this));
      this.studio.events.on('removeClassPrintView', this.onUpdateClassPrintView.bind(this));

      this.studio.events.on('createTask', this.onUpdateTask.bind(this));
      this.studio.events.on('updateTask', this.onUpdateTask.bind(this));
      this.studio.events.on('removeTask', this.onUpdateTask.bind(this));

      this.studio.events.on('createNavSection', this.onUpdateNavSection.bind(this));
      this.studio.events.on('updateNavSection', this.onUpdateNavSection.bind(this));
      this.studio.events.on('removeNavSection', this.onRemoveNavSection.bind(this));

      this.studio.events.on('createNavItem', this.onUpdateNavItem.bind(this));
      this.studio.events.on('updateNavItem', this.onUpdateNavItem.bind(this));
      this.studio.events.on('removeNavItem', this.onRemoveNavItem.bind(this));

      this.studio.events.on('createNavItemListView', this.onUpdateNavItemListView.bind(this));
      this.studio.events.on('updateNavItemListView', this.onUpdateNavItemListView.bind(this));
      this.studio.events.on('removeNavItemListView', this.onRemoveNavItemListView.bind(this));

      this.studio.events.on('createWorkflow', this.onUpdateWorkflow.bind(this));
      this.studio.events.on('updateWorkflow', this.onUpdateWorkflow.bind(this));
      this.studio.events.on('removeWorkflow', this.onRemoveWorkflow.bind(this));
      this.studio.events.on('createWorkflowState', this.onUpdateWorkflowItem.bind(this));
      this.studio.events.on('updateWorkflowState', this.onUpdateWorkflowItem.bind(this));
      this.studio.events.on('removeWorkflowState', this.onUpdateWorkflowItem.bind(this));
      this.studio.events.on('createWorkflowTransition', this.onUpdateWorkflowItem.bind(this));
      this.studio.events.on('updateWorkflowTransition', this.onUpdateWorkflowItem.bind(this));
      this.studio.events.on('removeWorkflowTransition', this.onUpdateWorkflowItem.bind(this));
    }
  },

  onChangeContentMode: function () {
    let app = this.studio.getActiveApp();
    if (app && app.isServerSync() && !app.loading) {
      app.loading = true;
      this.studio.toggleLoader(true);
      this.loadApp(app)
        .always(this.onAlwaysLoadApp.bind(this))
        .done(this.onDoneLoadApp.bind(this))
        .fail(this.onFailLoadApp.bind(this));
    }
  },

  onUpdateStudio: function (event, model) {
    this.change(model.app);
  },

  onUpdateApp: function (event, app) {
    let data = Object.assign({}, app.getData());
    delete data.serverSync;
    delete data.path;
    this.addUpdate(app, 'app', app.getName(), data);
    this.change(app);
  },

  onUpdateClass: function (event, model) {
    this.addUpdate(model.app, 'class', model.getOldName(), this.exportClassData(model));
    this.addClassDependencies(model);
    this.change(model.app);
  },

  addClassDependencies: function (model) {
    if (model.isNameChanged()) {
      let util = new Studio.AppDownload(model.app);
      model.getDependentClasses().forEach(function (item) {
        this.addUpdate(item.app, 'class', item.getName(), this.exportClassData(item));
      }, this);
      model.getDependentWorkflows().forEach(function (item) {
        this.addUpdate(item.app, 'workflow', item.getName(), this.exportClassData(item));
        this.addWorkflowDependencies(item);
      }, this);
      model.getDependentNavItems().forEach(function (item) {
        let data = util.getNavItemData(item);
        this.addUpdate(item.app, 'navItem', `${item.section.getName()}/${item.getCode()}`, data);
      }, this);
    }
  },

  onUpdateClassAttr: function (event, model) {
    model = model.cls;
    this.update(model.app, 'class', model.getName(), this.exportClassData(model));
  },

  exportClassData: function (model) {
    let data = model.exportData();
    delete data.views;
    delete data.printViews;
    return data;
  },

  onUpdateClassView: function (event, model) {
    if (model.navItem) {
      return this.onUpdateNavItemListView(event, model);
    }
    if (model.getWorkflowState()) {
      return this.onUpdateWorkflowView(event, model);
    }
    let util = new Studio.AppDownload(model.app);
    this.update(model.app, 'view', model.cls.getName() +'/'+ model.getName(), util.getClassViewData(model));
  },

  onUpdateClassViewAttr: function (event, model) {
    this.onUpdateClassView(event, model.view);
  },

  onUpdateClassViewGroup: function (event, model) {
    this.onUpdateClassView(event, model.view);
  },

  onUpdateClassPrintView: function (event, model) {
  },

  savePrintViews: function (root) {
    this.app.classes.forEach(function (model) {
      this.saveTypePrintViews('item', model, root);
      this.saveTypePrintViews('list', model, root);
    }, this);
  },

  saveTypePrintViews: function (type, cls, root) {
    var items = cls.getPrintViewsByType(type);
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      this.savePrintViewFile(item, i, root);
    }
  },

  savePrintViewFile: function (model, index, root) {
    try {
      var file = model.getFile();
      var dir = model.data.type + (index > 0 ? (index + 1) : '');
      var folder = root.folder(dir).folder(model.cls.app.getName());
      var fileName = model.cls.getName() +'.'+ model.data.extension;
      folder.file(fileName, Helper.File.getBlob(file.content));
    } catch (err) {
      console.error(err);
    }
  },

  onUpdateTask: function (event, model) {
    let util = new Studio.AppDownload(model.app);
    this.update(model.app, 'tasks', model.app.getName(), util.getTaskData());
  },

  onUpdateNavSection: function (event, model) {
    let data = model.exportData();
    delete data.items;
    this.update(model.app, 'navSection', model.getOldName(), data);
  },

  onUpdateNavItem: function (event, model) {
    let util = new Studio.AppDownload(model.app);
    let data = util.getNavItemData(model);
    this.update(model.app, 'navItem', `${model.section.getName()}/${model.getOldCode()}`, data);
  },

  onUpdateNavItemListView: function (event, model) {
    let util = new Studio.AppDownload(model.app);
    let data = util.getClassViewData(model);
    let item = model.navItem;
    this.update(model.app, 'navItemListView', `${item.getName()}/${model.cls.getNamespaceName()}`, data);
  },

  onUpdateWorkflow: function (event, model) {
    this.addUpdate(model.app, 'workflow', model.getOldName(), model.exportData());
    this.addWorkflowDependencies(model);
    this.change(model.app);
  },

  onUpdateWorkflowView: function (event, model) {
    let util = new Studio.AppDownload(model.app);
    let data = util.getClassViewData(model);
    let state = model.getWorkflowState();
    let name = `${state.workflow.getNamespaceName()}/${state.getName()}/${model.cls.getNamespaceName()}`;
    this.update(model.app, 'workflowView', name, data);
  },

  addWorkflowDependencies: function (model) {
    let util = new Studio.AppDownload(model.app);
    let workflowName = model.getNamespaceName();
    this.addUpdate(model.app, 'tasks', model.app.getName(), util.getTaskData());
    for (let state of model.states) {
      for (let view of state.views) {
        let data = util.getClassViewData(view);
        let name = `${workflowName}/${state.getName()}/${view.cls.getNamespaceName()}`;
        this.addUpdate(model.app, 'workflowView', name, data);
      }
    }
  },

  onUpdateWorkflowItem: function (event, model) {
    model = model.workflow;
    this.addUpdate(model.app, 'workflow', model.getName(), model.exportData());
    this.addWorkflowDependencies(model);
    this.change(model.app);
  },

  addUpdate: function (app, type, id, data) {
    this.addChange('update', app, type, id, data);
  },

  update: function (app, type, id, data) {
    this.change(app, 'update', type, id, data);
  },

  // REMOVE

  onRemoveApp: function (event, model) {
    this.remove(model, 'app', model.getName(), true);
  },

  onRemoveClass: function (event, model) {
    this.addRemove(model.app, 'class', model.getName());
    this.addClassDependencies(model);
    this.change(model.app);
  },

  onRemoveClassView: function (event, model) {
    this.remove(model.app, 'view', model.cls.getName() +'/'+ model.getName());
  },

  onRemoveNavSection: function (event, model) {
    this.remove(model.app, 'navSection', model.getName());
  },

  onRemoveNavItem: function (event, model) {
    this.remove(model.app, 'navItem', `${model.section.getName()}/${model.getCode()}`);
  },

  onRemoveNavItemListView: function (event, model) {
    let item = model.navItem;
    this.remove(model.app, 'navItemListView', `${item.getName()}/${model.cls.getNamespaceName()}`);
  },

  onRemoveWorkflow: function (event, model) {
    this.addRemove(model.app, 'workflow', model.getName());
    this.addWorkflowDependencies(model);
    this.change(model.app);
  },

  addRemove: function (app, type, id, data) {
    this.addChange('remove', app, type, id, data);
  },

  remove: function (app, type, id, skipStudioData) {
    this.change(app, 'remove', type, id, null, skipStudioData);
  },

  // SAVE

  addChange: function (action, app, type, id, data) {
    if (app.isServerSync()) {
      this.changedItems.push({
        'path': app.getPath(),
        'action': action,
        'type': type,
        'id': id,
        'data': data
      });
    }
  },

  change: function (app, action, type, id, data, skipStudioData) {
    if (app.isServerSync()) {
      if (action) {
        this.addChange(action, app, type, id, data);
      }
      if (!skipStudioData) {
        let util = new Studio.AppDownload(app);
        this.addUpdate(app, 'studio', app.getName(), util.getStudioData());
      }
      this.save();
    }
  },

  save: function () {
    if (this.changedItems.length && !this.pending) {
      this.pending = true;
      this.sentItems = this.changedItems;
      this.changedItems = [];
      this.ajax(this.api.update, {'items': this.sentItems})
        .always(function () {
          this.pending = false;
        }.bind(this))
        .done(function () {
          this.save();
        }.bind(this))
        .fail(function (xhr) {
          this.changedItems = this.sentItems.concat(this.changedItems);
          this.studio.alert.danger(xhr.responseText || 'Request failed');
        }.bind(this));
    }
  },

  // CREATE APP

  createApp: function (path) {
    return this.post(this.api.create, {'path': path}, this.onCreateApp.bind(this));
  },

  onCreateApp: function (data, deferred) {
    deferred.resolve(data);
  },

  // LOAD APP

  loadApp: function (app) {
    return this.post(this.api.get, {'path': app.getPath()}, this.onLoadApp.bind(this, app));
  },

  onAlwaysLoadApp: function (data) {
    this.studio.toggleLoader(false);
  },

  onDoneLoadApp: function ({app, data}) {
    this.studio.loadApp(app, data);
  },

  onFailLoadApp: function (error) {
    this.studio.alert.danger(error);
  },

  onLoadApp: function (app, data, deferred) {
    data = this.parseApp(data);
    if (!data) {
      return deferred.reject('Invalid app data');
    }
    deferred.resolve({app, data});
  },

  parseApp: function (data) {
    Helper.parseNestedJson(data);
    if (!this.validateApp(data)) {
      return null;
    }
    this.parser = new Studio.MetaParser(data);
    data.name = data.package.name;
    data.description = data.package.description;
    data.version = data.package.version;
    data.changedState = data.package.changedState;
    data.classes = data.meta ? Object.values(data.meta) : [];
    data.views = data.views || {};
    data.studio = data.studio || {};

    let studioClassMap = data.studio.classes || {};
    data.classes.forEach(this.parser.getClass.bind(this.parser, studioClassMap, data.views));
    data.navSections = this.parser.getNavSections(data.navigation, data) || [];

    let studioWorkflowMap = data.studio.workflows || {};
    let workflowViewMap = data.wfviews || {};
    this.parser.prepareWorkflowViews(workflowViewMap, studioClassMap);
    data.workflows = data.workflows ? Object.values(data.workflows) : [];
    data.workflows = data.workflows.map(this.parser.getWorkflow.bind(this.parser, studioWorkflowMap, workflowViewMap));

    data.interfaces = data.studio.interfaces || [];
    data.changeLogs = data.studio.changeLogs || [];
    data.deploy = data.deploy || {};

    delete data.studio;
    delete data.meta;
    delete data.views;
    delete data.navigation;
    delete data.package;
    delete data.wfviews;
    return data;
  },

  validateApp: function (data) {
    return data && data.package && data.package.name;
  },

  post: function (url, data, done, fail) {
    let deferred = $.Deferred();
    this.ajax(url, data).done(function (data) {
      done ? done(data, deferred) : deferred.resolve(data);
    }.bind(this)).fail(function (xhr) {
      deferred.reject(fail ? fail(xhr) : (xhr.responseText || 'Request failed'));
    }.bind(this));
    return deferred;
  },

  ajax: function (url, data) {
    return $.ajax({
      'url': url,
      'data': JSON.stringify(data),
      'method': 'post',
      'dataType': 'json',
      'contentType': 'application/json',
    });
  }
});
