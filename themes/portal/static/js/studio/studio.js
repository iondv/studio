"use strict";

window.Studio = function ($main) {
  this.VISITED_STORE_KEY = 'iondv-studio-visited';
  this.$main = $main;
  this.$main.data('studio', this);
  this.$samples = this.$main.find('script').filter('[type="sample"]');
  this.$globalLoader = $('#global-loader');
  this.events = new Helper.Events('studio:');
  this.store = new Studio.Store('ion-studio-store', this);
  this.toolbar = new Studio.Toolbar(this.$main.find('.studio-toolbar'), this);
  this.sidebar = new Studio.Sidebar(this.$main.find('.studio-sidebar'), this);
  this.tabs = new Studio.Tabs(this.$main.find('.studio-tabs'), this);
  this.menu = new Studio.SidebarMenu(this.$main.find('.studio-sidebar-menu'), this);

  this.appForm = new Studio.AppForm($('#app-modal'), this);
  this.appMergeForm = new Studio.AppMergeForm($('#app-merge-modal'), this);
  this.classForm = new Studio.ClassForm($('#class-modal'), this);
  this.classAttrForm = new Studio.ClassAttrForm($('#class-attr-modal'), this);
  this.classViewForm = new Studio.ClassViewForm($('#class-view-modal'), this);
  this.classViewAttrForm = new Studio.ClassViewAttrForm($('#class-view-attr-modal'), this);
  this.classViewGroupForm = new Studio.ClassViewGroupForm($('#class-view-group-modal'), this);
  this.classPrintViewForm = new Studio.ClassPrintViewForm($('#class-print-view-modal'), this);
  this.workflowForm = new Studio.WorkflowForm($('#workflow-modal'), this);
  this.workflowStateForm = new Studio.WorkflowStateForm($('#workflow-state-modal'), this);
  this.workflowTransitionForm = new Studio.WorkflowTransitionForm($('#workflow-transition-modal'), this);
  this.navSectionForm = new Studio.NavSectionForm($('#nav-section-modal'), this);
  this.navItemForm = new Studio.NavItemForm($('#nav-item-modal'), this);
  this.navItemListViewForm = new Studio.NavItemListViewForm($('#nav-item-list-view-modal'), this);
  this.taskForm = new Studio.TaskForm($('#task-modal'), this);
  this.interfaceForm = new Studio.InterfaceForm($('#interface-modal'), this);
  this.externalServiceForm = new Studio.ExternalServiceForm($('#external-service-modal'), this);
  this.exportForm = new Studio.ExportForm($('#export-modal'), this);
  this.importTaskForm = new Studio.ImportTaskForm($('#import-task-modal'), this);
  this.codeEditorForm = new Studio.CodeEditorForm($('#code-editor-modal'), this);

  this.deployForm = new Studio.DeployForm($('#deploy-modal'), this);
  this.deployGlobalForm = new Studio.DeployGlobalForm($('#deploy-global-modal'), this);
  this.deployGlobalModuleTitleForm = new Studio.DeployGlobalModuleTitleForm($('#deploy-global-module-title-modal'), this);
  this.deployGlobalTopMenuForm = new Studio.DeployGlobalTopMenuForm($('#deploy-global-top-menu-modal'), this);
  this.deployGlobalPluginForm = new Studio.DeployGlobalPluginForm($('#deploy-global-plugin-modal'), this);
  this.deployGlobalJobForm = new Studio.DeployGlobalJobForm($('#deploy-global-job-modal'), this);

  this.deployModuleForm = new Studio.DeployModuleForm($('#deploy-module-modal'), this);
  this.deployModuleRegistryForm = new Studio.DeployModuleRegistryForm($('#deploy-module-registry-modal'), this);
  this.deployModuleRestForm = new Studio.DeployModuleRestForm($('#deploy-module-rest-modal'), this);

  this.modalHelp = new Studio.Modal($('#studio-modal-help'), this);
  this.alert = new Studio.ModalAlert($('#studio-modal-alert'), this);
  this.classUml = new Studio.ClassUmlAdapter(this.$main.find('.studio-class-uml'), this);
  this.workflowUml = new Studio.WorkflowUmlAdapter(this.$main.find('.studio-workflow-uml'), this);
  this.interfaceAdapter = new Studio.InterfaceAdapter(this.$main.find('.studio-interface-container'), this);
  this.listViewMaker = new Studio.ListViewMaker(this.$main.find('.studio-list-container'), this);
  this.printViewMaker = new Studio.PrintViewMaker(this.$main.find('.studio-print-container'), this);
  this.viewMaker = new Studio.ViewMaker(this.$main.find('.studio-view-container'), this);
  this.workflowViewMaker = new Studio.WorkflowViewMaker(this.$main.find('.studio-workflow-view-container'), this);
  this.taskArea = new Studio.TaskArea(this.$main.find('.studio-task-container'), this);
  this.changelogArea = new Studio.ChangelogArea(this.$main.find('.studio-changelog-container'), this);

  this.deploy = new Studio.DeployModelView(this.$main.find('.studio-deploy'), this);
  this.deployGlobal = new Studio.DeployGlobalModelView(this.$main.find('.studio-deploy-global'), this);
  this.deployGlobalModuleTitleList = new Studio.DeployGlobalModuleTitleList(this.$main.find('.deploy-global-module-title-list'), this);
  this.deployGlobalTopMenuList = new Studio.DeployGlobalTopMenuList(this.$main.find('.deploy-global-top-menu-list'), this);
  this.deployGlobalPluginList = new Studio.DeployGlobalPluginList(this.$main.find('.deploy-global-plugin-list'), this);
  this.deployGlobalJobList = new Studio.DeployGlobalJobList(this.$main.find('.deploy-global-job-list'), this);
  this.deployModuleList = new Studio.DeployModuleList(this.$main.find('.deploy-module-list'), this);
  this.deployModule = new Studio.DeployModuleModelView(this.$main.find('.studio-deploy-module'), this);

  this.standalone = new Studio.Standalone(this, this.$main.data('standalone'));
  this.sandbox = new Studio.Sandbox(this, this.$main.data('sandbox'));

  this.init();
};

$.extend(Studio.prototype, {

  init: function () {
    this.$main.show();
    this.clearAll();
    this.store.load();
    this.classUml.restore();
    this.tabs.restore();
    this.workflowUml.restore();
    this.initListeners();
    this.setContentMode('class');
    this.toggleLoader(false);
    this.menu.setActiveFirstApp();
    this.toggleCreateTooltip(!this.apps.length);

    setTimeout(function () {
      store.set(this.VISITED_STORE_KEY, true);
    }.bind(this), 0);

    /*setTimeout(function () {
      //$('.menu-item[data-type="deploy"]').find('>.menu-item-head >.menu-item-title').click();
      //$('.menu-item[data-type="deployModules"]').find('>.menu-item-head >.menu-item-title').click();
      //$('.btn[data-action="viewMode"]').click();
      //var $select = $('[data-action="selectClassView"]');
      //$select.val($select.find('option').last().attr('value'));
      //$('.uml-rect-attr').first().dblclick();
    }.bind(this), 500); //*/
  },

  initListeners: function () {
    this.toolbar.initListeners();
    this.tabs.initListeners();
    this.store.initListeners();
    this.menu.initListeners();
    this.classUml.initListeners();
    this.workflowUml.initListeners();
    this.interfaceAdapter.initListeners();
    this.listViewMaker.initListeners();
    this.printViewMaker.initListeners();
    this.viewMaker.initListeners();
    this.workflowViewMaker.initListeners();
    this.taskArea.initListeners();
    this.changelogArea.initListeners();
    this.standalone.initListeners();
    this.sandbox.initListeners();

    this.deploy.initListeners();
    this.deployGlobal.initListeners();
    this.deployGlobalModuleTitleList.initListeners();
    this.deployGlobalTopMenuList.initListeners();
    this.deployGlobalPluginList.initListeners();
    this.deployGlobalJobList.initListeners();
    this.deployModuleList.initListeners();
    this.deployModule.initListeners();

    this.appForm.events.on('create', this.onCreateApp.bind(this));
    this.appForm.events.on('update', this.onUpdateApp.bind(this));
    this.appMergeForm.events.on('close', this.onCloseAppMerge.bind(this));
    this.classForm.events.on('create', this.onCreateClass.bind(this));
    this.classForm.events.on('update', this.onUpdateClass.bind(this));
    this.classAttrForm.events.on('create', this.onCreateClassAttr.bind(this));
    this.classAttrForm.events.on('update', this.onUpdateClassAttr.bind(this));
    this.classViewForm.events.on('create', this.onCreateClassView.bind(this));
    this.classViewForm.events.on('update', this.onUpdateClassView.bind(this));
    this.classViewAttrForm.events.on('create', this.onCreateClassViewAttr.bind(this));
    this.classViewAttrForm.events.on('update', this.onUpdateClassViewAttr.bind(this));
    this.classViewGroupForm.events.on('create', this.onCreateClassViewGroup.bind(this));
    this.classViewGroupForm.events.on('update', this.onUpdateClassViewGroup.bind(this));
    this.classPrintViewForm.events.on('create', this.onCreateClassPrintView.bind(this));
    this.classPrintViewForm.events.on('update', this.onUpdateClassPrintView.bind(this));

    this.workflowForm.events.on('create', this.onCreateWorkflow.bind(this));
    this.workflowForm.events.on('update', this.onUpdateWorkflow.bind(this));
    this.workflowStateForm.events.on('create', this.onCreateWorkflowState.bind(this));
    this.workflowStateForm.events.on('update', this.onUpdateWorkflowState.bind(this));
    this.workflowTransitionForm.events.on('create', this.onCreateWorkflowTransition.bind(this));
    this.workflowTransitionForm.events.on('update', this.onUpdateWorkflowTransition.bind(this));
    this.navSectionForm.events.on('create', this.onCreateNavSection.bind(this));
    this.navSectionForm.events.on('update', this.onUpdateNavSection.bind(this));
    this.navItemForm.events.on('create', this.onCreateNavItem.bind(this));
    this.navItemForm.events.on('update', this.onUpdateNavItem.bind(this));
    this.navItemListViewForm.events.on('create', this.onCreateNavItemListView.bind(this));
    this.navItemListViewForm.events.on('update', this.onUpdateNavItemListView.bind(this));
    this.taskForm.events.on('create', this.onCreateTask.bind(this));
    this.taskForm.events.on('update', this.onUpdateTask.bind(this));
    this.interfaceForm.events.on('create', this.onCreateInterface.bind(this));
    this.interfaceForm.events.on('update', this.onUpdateInterface.bind(this));

    this.deployForm.events.on('update', this.onUpdateDeploy.bind(this));
    this.deployGlobalForm.events.on('update', this.onUpdateDeployGlobal.bind(this));
    this.deployGlobalModuleTitleForm.events.on('create', this.onCreateDeployGlobalModuleTitle.bind(this));
    this.deployGlobalModuleTitleForm.events.on('update', this.onUpdateDeployGlobalModuleTitle.bind(this));
    this.deployGlobalTopMenuForm.events.on('create', this.onCreateDeployGlobalTopMenu.bind(this));
    this.deployGlobalTopMenuForm.events.on('update', this.onUpdateDeployGlobalTopMenu.bind(this));
    this.deployGlobalPluginForm.events.on('create', this.onCreateDeployGlobalPlugin.bind(this));
    this.deployGlobalPluginForm.events.on('update', this.onUpdateDeployGlobalPlugin.bind(this));
    this.deployGlobalJobForm.events.on('create', this.onCreateDeployGlobalJob.bind(this));
    this.deployGlobalJobForm.events.on('update', this.onUpdateDeployGlobalJob.bind(this));

    //this.deployModuleForm.events.on('create', this.onCreateDeployModule.bind(this));
    this.deployModuleForm.events.on('update', this.onUpdateDeployModule.bind(this));
    this.deployModuleRegistryForm.events.on('update', this.onUpdateDeployModule.bind(this));
    this.deployModuleRestForm.events.on('update', this.onUpdateDeployModule.bind(this));
  },

  canExport: function () {
    const app = this.getActiveApp();
    return !!(app && app.classes.length);
  },

  clearAll: function () {
    this.apps = [];
    this.events.trigger('clearAll');
  },

  isListViewMode: function () {
    return this.contentMode === 'listView';
  },

  isWorkflowViewMode: function () {
    return this.contentMode === 'workflowView';
  },

  setContentMode: function (mode) {
    const app = this.getActiveApp();
    if (!app) {
      mode = null;
    }
    if (mode !== this.contentMode || app !== this.lastActiveApp) {
      this.lastActiveApp = app;
      this.contentMode = mode;
      this.events.trigger('changeContentMode', mode);
      return true;
    }
  },

  togglePendingApp: function (state) {
    this.$main.toggleClass('pending-app', state);
  },

  toggleLoader: function (state) {
    $(':focus').blur();
    this.$globalLoader.toggle(state);
  },

  triggerModelChanging: function (eventName, model) {
    if (model) {
      this.events.trigger(eventName, model);
      if (eventName.indexOf('remove') === 0) {
        this.events.trigger('removeModel', model);
      } else if (eventName.indexOf('update') === 0) {
        this.events.trigger('updateModel', model);
      }
      this.triggerChangeModel(model);
    }
  },

  triggerChangeModel: function (model) {
    this.events.trigger('changeModel', model);
  },

  triggerChangeActiveItem: function () {
    setTimeout(function () {
      this.events.trigger('changeActiveItem');
    }.bind(this), 0);
  },

  renderAlertSample: function (type, message) {
    return this.renderSample('alert', {
      'type': type,
      'message': Helper.L10n.translate(message)
    });
  },

  renderSample: function (id, params) {
    var content = this.$samples.filter('[data-id="'+ id +'"]').html();
    return Helper.resolveTemplate(content, params);
  },

  // APP

  getApp: function (id) {
    return this.apps[Helper.Array.searchByNestedValue(id, 'id', this.apps)];
  },

  getAppByName: function (name) {
    return this.apps[Helper.Array.searchByNestedValue(name, 'data.name', this.apps)];
  },

  getActiveApp: function () {
    return this.menu.getActiveApp();
  },

  onCreateApp: function (event, data) {
    this.triggerCreateApp(this.createApp(data));
  },

  createApp: function (data) {
    try {
      var model = new Studio.AppModel(this, data);
      this.apps.push(model);
      this.toggleCreateTooltip(false);
      return model;
    } catch (err) {
      console.error(err);
    }
  },

  triggerCreateApp: function (model) {
    this.triggerModelChanging('createApp', model);
  },

  loadApp: function (model, data) {
    model.importData(data);
    this.events.trigger('loadApp', model);
  },

  onUpdateApp: function (event, model) {
    this.triggerModelChanging('updateApp', model);
  },

  removeApp: function (model) {
    Helper.Array.removeValue(model, this.apps);
    this.syncFiles();
    this.triggerModelChanging('removeApp', model);
    this.toggleCreateTooltip(!this.apps.length);
  },

  onUploadApp: function (data) {
    var app = this.getAppByName(data.name);
    if (app) {
      return this.appMergeForm.show(app, data);
    }
    app = this.createApp(data);
    app.afterUpload();
    this.triggerCreateApp(app);
  },

  onCloseAppMerge: function () {
    var source = this.appMergeForm.app;
    var app = this.createApp(source.exportData());
    this.removeApp(source);
    this.triggerCreateApp(app);
  },

  // CLASS

  getClass: function (classId, appId) {
    var app = this.getApp(appId);
    return app ? app.getClass(classId) : null;
  },

  getActiveClass: function () {
    return this.menu.getActiveClass();
  },

  onCreateClass: function (event, data) {
    var model = this.getActiveApp().createClass(data);
    this.triggerCreateClass(model);
    this.classAttrForm.createClassId(model);
  },

  onUpdateClass: function (event, model) {
    this.triggerModelChanging('updateClass', model);
  },

  triggerCreateClass: function (model) {
    this.triggerModelChanging('createClass', model);
  },

  triggerRemoveClass: function (model) {
    this.syncFiles();
    this.triggerModelChanging('removeClass', model);
  },

  // CLASS ATTR

  getClassAttr: function (attrId, classId, appId) {
    var app = this.getApp(appId);
    return app ? app.getClassAttr(attrId, classId) : null;
  },

  getActiveClassAttr: function () {
    return this.menu.getActiveClassAttr();
  },

  onCreateClassAttr: function (event, data) {
    var model = this.getActiveClass().createAttr(data);
    var asKey = model.setAsDefaultKey();
    this.triggerModelChanging('createClassAttr', model);
  },

  onUpdateClassAttr: function (event, model) {
    this.triggerModelChanging('updateClassAttr', model);
  },

  triggerRemoveClassAttr: function (model) {
    this.triggerModelChanging('removeClassAttr', model);
  },

  // CLASS VIEW

  getClassView: function (id, classId, appId) {
    var app = this.getApp(appId);
    return app ? app.getClassView(id, classId) : null;
  },

  getActiveClassView: function (defaultViewId) {
    if (this.isListViewMode()) {
      return this.listViewMaker.getActiveView();
    }
    if (this.isWorkflowViewMode()) {
      return this.toolbar.getActiveWorkflowView();
    }
    var model = this.getActiveClass();
    return model && model.getView(this.toolbar.getActiveClassViewId() || defaultViewId);
  },

  triggerSelectClassView: function (model) {
    this.events.trigger('selectClassView', this.getActiveClassView());
  },

  onCreateClassView: function (event, data) {
    this.triggerModelChanging('createClassView', this.getActiveClass().createView(data));
  },

  onUpdateClassView: function (event, model) {
    this.triggerModelChanging('updateClassView', model);
  },

  triggerRemoveClassView: function (model) {
    this.triggerModelChanging('removeClassView', model);
  },

  // CLASS VIEW ATTR

  getClassViewAttr: function (id, viewId, classId, appId) {
    var app = this.getApp(appId);
    return app ? app.getClassViewAttr(id, viewId, classId) : null;
  },

  getActiveClassViewAttr: function () {
    if (this.isListViewMode()) {
      return this.listViewMaker.getActiveViewAttr();
    }
    var view = this.getActiveClassView();
    return view ? view.getAttr(this.viewMaker.getActiveViewAttrId()) : null;
  },

  onCreateClassViewAttr: function (event, data) {
    this.triggerModelChanging('createClassViewAttr', this.classViewAttrForm.view.createAttr(data));
  },

  onUpdateClassViewAttr: function (event, model) {
    this.triggerModelChanging('updateClassViewAttr', model);
  },

  triggerRemoveClassViewAttr: function (model) {
    this.triggerModelChanging('removeClassViewAttr', model);
  },

  // CLASS VIEW GROUP

  getClassViewGroup: function (id, viewId, classId, appId) {
    var app = this.getApp(appId);
    return app ? app.getClassViewGroup(id, viewId, classId) : null;
  },

  getActiveClassViewGroup: function () {
    var view = this.getActiveClassView();
    return view ? view.getGroup(this.viewMaker.getActiveViewGroupId()) : null;
  },

  onCreateClassViewGroup: function (event, data) {
    var model = this.getActiveClassView().createGroup(data);
    if (model) {
      model.view.setNotGroupedItemsToTab();
      this.triggerModelChanging('createClassViewGroup', model);
    }
  },

  onUpdateClassViewGroup: function (event, model) {
    model.view.setNotGroupedItemsToTab();
    this.triggerModelChanging('updateClassViewGroup', model);
  },

  triggerRemoveClassViewGroup: function (model) {
    this.triggerModelChanging('removeClassViewGroup', model);
  },

  // CLASS PRINT VIEW

  getClassPrintView: function (id, classId, appId) {
    var app = this.getApp(appId);
    return app ? app.getClassPrintView(id, classId) : null;
  },

  getActiveClassPrintView: function (defaultId) {
    var model = this.getActiveClass();
    return model && model.getPrintView(this.printViewMaker.getActivePrintViewId() || defaultId);
  },

  triggerSelectClassPrintView: function (model) {
    this.events.trigger('selectClassPrintView', this.getActiveClassPrintView());
  },

  onCreateClassPrintView: function (event, data) {
    this.triggerModelChanging('createClassPrintView', this.getActiveClass().createPrintView(data));
  },

  onUpdateClassPrintView: function (event, model) {
    this.triggerModelChanging('updateClassPrintView', model);
  },

  triggerRemoveClassPrintView: function (model) {
    this.triggerModelChanging('removeClassPrintView', model);
  },

  // WORKFLOW

  getWorkflow: function (id, appId) {
    var app = this.getApp(appId);
    return app ? app.getWorkflow(id) : null;
  },

  getActiveWorkflow: function () {
    return this.menu.getActiveWorkflow();
  },

  onCreateWorkflow: function (event, data) {
    this.triggerCreateWorkflow(this.getActiveApp().createWorkflow(data));
  },

  onUpdateWorkflow: function (event, model) {
    this.triggerModelChanging('updateWorkflow', model);
  },

  triggerCreateWorkflow: function (model) {
    this.triggerModelChanging('createWorkflow', model);
  },

  triggerRemoveWorkflow: function (model) {
    this.triggerModelChanging('removeWorkflow', model);
  },

  // WORKFLOW STATE

  getWorkflowState: function (id, workflowId, appId) {
    var app = this.getApp(appId);
    return app ? app.getWorkflowState(id, workflowId) : null;
  },

  getActiveWorkflowState: function () {
    return this.menu.getActiveWorkflowState();
  },

  onCreateWorkflowState: function (event, data) {
    this.triggerModelChanging('createWorkflowState', this.getActiveWorkflow().createState(data));
  },

  onUpdateWorkflowState: function (event, model) {
    this.triggerModelChanging('updateWorkflowState', model);
  },

  triggerRemoveWorkflowState: function (model) {
    this.triggerModelChanging('removeWorkflowState', model);
  },

  // WORKFLOW TRANSITION

  getWorkflowTransition: function (id, workflowId, appId) {
    var app = this.getApp(appId);
    return app ? app.getWorkflowTransition(id, workflowId) : null;
  },

  getActiveWorkflowTransition: function () {
    return this.menu.getActiveWorkflowTransition();
  },

  onCreateWorkflowTransition: function (event, data) {
    this.triggerModelChanging('createWorkflowTransition', this.getActiveWorkflow().createTransition(data));
  },

  onUpdateWorkflowTransition: function (event, model) {
    this.triggerModelChanging('updateWorkflowTransition', model);
  },

  triggerRemoveWorkflowTransition: function (model) {
    this.triggerModelChanging('removeWorkflowTransition', model);
  },

  // WORKFLOW VIEW

  triggerSelectWorkflowViewClass: function (model) {
    this.events.trigger('selectWorkflowViewClass', model);
  },

  triggerSelectWorkflowViewState: function (model) {
    this.events.trigger('selectWorkflowViewState', model);
  },

  triggerRemoveWorkflowView: function (model) {
    this.triggerModelChanging('removeWorkflowView', model);
  },

  getActiveWorkflowViewAttr: function () {
    var view = this.toolbar.getActiveWorkflowView();
    return view ? view.getAttr(this.workflowViewMaker.getActiveViewAttrId()) : null;
  },

  getActiveWorkflowViewGroup: function () {
    var view = this.getActiveClassView();
    return view ? view.getGroup(this.workflowViewMaker.getActiveViewGroupId()) : null;
  },

  // NAV SECTION

  getActiveNav: function () {
    return this.getActiveNavItem() || this.getActiveNavSection();
  },

  getActiveNavSection: function () {
    return this.menu.getActiveNavSection();
  },

  getNavSection: function (id, appId) {
    var app = this.getApp(appId);
    return app ? app.getNavSection(id) : null;
  },

  onCreateNavSection: function (event, data) {
    this.triggerCreateNavSection(this.getActiveApp().createNavSection(data));
  },

  onUpdateNavSection: function (event, model) {
    this.triggerModelChanging('updateNavSection', model);
  },

  triggerCreateNavSection: function (model) {
    this.triggerModelChanging('createNavSection', model);
  },

  triggerRemoveNavSection: function (model) {
    this.triggerModelChanging('removeNavSection', model);
  },

  // NAV ITEM

  getActiveNavItem: function () {
    return this.menu.getActiveNavItem();
  },

  getNavItem: function (id, sectionId, appId) {
    var app = this.getApp(appId);
    return app ? app.getNavItem(id, sectionId) : null;
  },

  onCreateNavItem: function (event, data) {
    this.triggerCreateNavItem(this.getActiveNav().createItem(data));
  },

  onUpdateNavItem: function (event, model) {
    this.triggerModelChanging('updateNavItem', model);
    this.menu.setValidContentMode(this.menu.getActive());
  },

  triggerCreateNavItem: function (model) {
    this.triggerModelChanging('createNavItem', model);
  },

  triggerRemoveNavItem: function (model) {
    this.triggerModelChanging('removeNavItem', model);
  },

  // NAV ITEM LIST VIEW

  onCreateNavItemListView: function (event, data) {
    this.triggerCreateNavItemListView(this.getActiveNav().createListView(data));
  },

  onUpdateNavItemListView: function (event, model) {
    this.triggerModelChanging('updateNavItemListView', model);
  },

  triggerCreateNavItemListView: function (model) {
    this.triggerModelChanging('createNavItemListView', model);
  },

  triggerRemoveNavItemListView: function (model) {
    this.triggerModelChanging('removeNavItemListView', model);
  },

  // TASK

  getTask: function (id, appId) {
    var app = this.getApp(appId);
    return app ? app.getTask(id) : null;
  },

  getActiveTask: function () {
    return this.menu.getActiveTask();
  },

  onCreateTask: function (event, data) {
    this.triggerCreateTask(this.getActiveApp().createTask(data));
  },

  onUpdateTask: function (event, model) {
    this.triggerModelChanging('updateTask', model);
  },

  triggerCreateTask: function (model) {
    this.triggerModelChanging('createTask', model);
  },

  triggerRemoveTask: function (model) {
    this.triggerModelChanging('removeTask', model);
  },

  // INTERFACE

  getInterface: function (id, appId) {
    var app = this.getApp(appId);
    return app ? app.getInterface(id) : null;
  },

  getActiveInterface: function () {
    return this.menu.getActiveInterface();
  },

  onCreateInterface: function (event, data) {
    this.triggerCreateInterface(this.getActiveApp().createInterface(data));
  },

  onUpdateInterface: function (event, model) {
    this.triggerModelChanging('updateInterface', model);
  },

  triggerCreateInterface: function (model) {
    this.triggerModelChanging('createInterface', model);
  },

  triggerRemoveInterface: function (model) {
    this.triggerModelChanging('removeInterface', model);
  },

  // UTIL

  syncFiles: function () {
    var result = {};
    Helper.Array.eachMethod('indexFiles', this.apps, result);
    Helper.File.sync(result);
  },

  toggleCreateTooltip: function (state) {
    if (!state) {
      return this.tabs.$add.tooltip('destroy');
    }
    this.tabs.$add.tooltip({
      'title': Helper.L10n.translate('Create your first app'),
      'trigger': 'manual',
      'placement': 'bottom',
      'animation': false
    }).tooltip('show');
  },

  resolveAutoHelp: function () {
    if (!store.get(this.VISITED_STORE_KEY)) {
      this.toolbar.getTool('help').click();
    }
  },

  // DEPLOY

  getActiveDeploy: function () {
    return this.getActiveApp().deploy;
  },
  onUpdateDeploy: function (event, model) {
    this.triggerModelChanging('updateDeploy', model);
  },

  // DEPLOY GLOBAL

  getActiveDeployGlobal: function () {
    return this.getActiveDeploy().global;
  },
  onUpdateDeployGlobal: function (event, model) {
    this.triggerModelChanging('updateDeployGlobal', model);
  },

  // DEPLOY GLOBAL MODULE TITLE

  getActiveDeployGlobalModuleTitle: function () {
    return this.deployGlobalModuleTitleList.getActiveModel();
  },
  onCreateDeployGlobalModuleTitle: function (event, data) {
    this.triggerCreateDeployGlobalModuleTitle(this.getActiveDeployGlobal().createModuleTitle(data));
  },
  onUpdateDeployGlobalModuleTitle: function (event, model) {
    this.triggerModelChanging('updateDeployGlobalModuleTitle', model);
  },
  triggerCreateDeployGlobalModuleTitle: function (model) {
    this.triggerModelChanging('createDeployGlobalModuleTitle', model);
  },
  triggerRemoveDeployGlobalModuleTitle: function (model) {
    this.triggerModelChanging('removeDeployGlobalModuleTitle', model);
  },

  // DEPLOY GLOBAL TOP MENU

  getActiveDeployGlobalTopMenu: function () {
    return this.deployGlobalTopMenuList.getActiveModel();
  },
  onCreateDeployGlobalTopMenu: function (event, data) {
    this.triggerCreateDeployGlobalTopMenu(this.getActiveDeployGlobal().createTopMenuItem(data));
  },
  onUpdateDeployGlobalTopMenu: function (event, model) {
    this.triggerModelChanging('updateDeployGlobalTopMenu', model);
  },
  triggerCreateDeployGlobalTopMenu: function (model) {
    this.triggerModelChanging('createDeployGlobalTopMenu', model);
  },
  triggerRemoveDeployGlobalTopMenu: function (model) {
    this.triggerModelChanging('removeDeployGlobalTopMenu', model);
  },

  // DEPLOY GLOBAL PLUGIN

  getActiveDeployGlobalPlugin: function () {
    return this.deployGlobalPluginList.getActiveModel();
  },
  onCreateDeployGlobalPlugin: function (event, data) {
    this.triggerCreateDeployGlobalPlugin(this.getActiveDeployGlobal().createPlugin(data));
  },
  onUpdateDeployGlobalPlugin: function (event, model) {
    this.triggerModelChanging('updateDeployGlobalPlugin', model);
  },
  triggerCreateDeployGlobalPlugin: function (model) {
    this.triggerModelChanging('createDeployGlobalPlugin', model);
  },
  triggerRemoveDeployGlobalPlugin: function (model) {
    this.triggerModelChanging('removeDeployGlobalPlugin', model);
  },

  // DEPLOY GLOBAL JOB

  getActiveDeployGlobalJob: function () {
    return this.deployGlobalJobList.getActiveModel();
  },
  onCreateDeployGlobalJob: function (event, data) {
    this.triggerCreateDeployGlobalJob(this.getActiveDeployGlobal().createJob(data));
  },
  onUpdateDeployGlobalJob: function (event, model) {
    this.triggerModelChanging('updateDeployGlobalJob', model);
  },
  triggerCreateDeployGlobalJob: function (model) {
    this.triggerModelChanging('createDeployGlobalJob', model);
  },
  triggerRemoveDeployGlobalJob: function (model) {
    this.triggerModelChanging('removeDeployGlobalJob', model);
  },

  // DEPLOY MODULE

  getActiveDeployModule: function () {
    return this.menu.getActiveDeployModule();
    //return this.deployModuleList.getActiveModel();
  },
  getDeployModule: function (module, appId) {
    var app = this.getApp(appId);
    return app ? app.deploy.getModule(module) : null;
  },
  getDeployModuleForm: function (name) {
    switch (name.name || name) {
      case 'registry': return this.deployModuleRegistryForm;
      case 'rest': return this.deployModuleRestForm;
    }
    return this.deployModuleForm;
  },

  onUpdateDeployModule: function (event, model) {
    this.triggerModelChanging('updateDeployModule', model);
  },
  onCreateDeployModule: function (event, data) {
    this.triggerCreateDeployGlobalJob(this.getActiveDeploy().createModule(data));
  },
  triggerCreateDeployModule: function (model) {
    this.triggerModelChanging('createDeployModule', model);
  },
  triggerRemoveDeployModule: function (model) {
    this.triggerModelChanging('removeDeployModule', model);
  }
});
