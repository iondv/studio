"use strict";

Studio.Toolbar = function ($toolbar, studio) {
  this.studio = studio;
  this.$toolbar = $toolbar;
  this.$appFile = $toolbar.find('.upload-app-file');
  this.init();
};

$.extend(Studio.Toolbar.prototype, {

  init: function () {
    this.getTool('createApp').click(this.onCreateApp.bind(this));
    this.getTool('updateApp').click(this.onUpdateApp.bind(this));
    this.getTool('removeApp').click(this.onRemoveApp.bind(this));

    this.getTool('downloadApp').click(this.onDownloadApp.bind(this));
    this.getTool('uploadApp').click(this.onUploadApp.bind(this));
    this.getTool('exportApp').click(this.onExportApp.bind(this));

    this.$appFile.change(this.onChangeAppFile.bind(this));

    this.getTool('createClass').click(this.onCreateClass.bind(this));
    this.getTool('cloneClass').click(this.onCloneClass.bind(this));
    this.getTool('updateClass').click(this.onUpdateClass.bind(this));
    this.getTool('removeClass').click(this.onRemoveClass.bind(this));

    this.getTool('createClassAttr').click(this.onCreateClassAttr.bind(this));
    this.getTool('updateClassAttr').click(this.onUpdateClassAttr.bind(this));
    this.getTool('removeClassAttr').click(this.onRemoveClassAttr.bind(this));

    this.getTool('createClassView').click(this.onCreateClassView.bind(this));
    this.getTool('updateClassView').click(this.onUpdateClassView.bind(this));
    this.getTool('removeClassView').click(this.onRemoveClassView.bind(this));
    this.getTool('createClassViewAttr').click(this.onCreateClassViewAttr.bind(this));
    this.getTool('updateClassViewAttr').click(this.onUpdateClassViewAttr.bind(this));
    this.getTool('removeClassViewAttr').click(this.onRemoveClassViewAttr.bind(this));
    this.getTool('appendAllClassAttrs').click(this.onAppendAllClassAttrs.bind(this));
    this.getTool('createClassViewGroup').click(this.onCreateClassViewGroup.bind(this));
    this.getTool('updateClassViewGroup').click(this.onUpdateClassViewGroup.bind(this));
    this.getTool('removeClassViewGroup').click(this.onRemoveClassViewGroup.bind(this));

    this.getTool('createClassPrintView').click(this.onCreateClassPrintView.bind(this));
    this.getTool('updateClassPrintView').click(this.onUpdateClassPrintView.bind(this));
    this.getTool('removeClassPrintView').click(this.onRemoveClassPrintView.bind(this));

    this.getTool('createWorkflow').click(this.onCreateWorkflow.bind(this));
    this.getTool('cloneWorkflow').click(this.onCloneWorkflow.bind(this));
    this.getTool('updateWorkflow').click(this.onUpdateWorkflow.bind(this));
    this.getTool('removeWorkflow').click(this.onRemoveWorkflow.bind(this));

    this.getTool('createWorkflowState').click(this.onCreateWorkflowState.bind(this));
    this.getTool('updateWorkflowState').click(this.onUpdateWorkflowState.bind(this));
    this.getTool('removeWorkflowState').click(this.onRemoveWorkflowState.bind(this));
    this.getTool('createWorkflowTransition').click(this.onCreateWorkflowTransition.bind(this));
    this.getTool('updateWorkflowTransition').click(this.onUpdateWorkflowTransition.bind(this));
    this.getTool('removeWorkflowTransition').click(this.onRemoveWorkflowTransition.bind(this));

    this.getTool('updateWorkflowView').click(this.onUpdateWorkflowView.bind(this));
    //this.getTool('removeWorkflowView').click(this.onRemoveWorkflowView.bind(this));
    this.getTool('createWorkflowViewAttr').click(this.onCreateWorkflowViewAttr.bind(this));
    this.getTool('updateWorkflowViewAttr').click(this.onUpdateWorkflowViewAttr.bind(this));
    this.getTool('removeWorkflowViewAttr').click(this.onRemoveWorkflowViewAttr.bind(this));
    this.getTool('appendAllWorkflowAttrs').click(this.onAppendAllWorkflowAttrs.bind(this));
    this.getTool('createWorkflowViewGroup').click(this.onCreateWorkflowViewGroup.bind(this));
    this.getTool('updateWorkflowViewGroup').click(this.onUpdateWorkflowViewGroup.bind(this));
    this.getTool('removeWorkflowViewGroup').click(this.onRemoveWorkflowViewGroup.bind(this));

    this.getTool('createNavSection').click(this.onCreateNavSection.bind(this));
    this.getTool('updateNavSection').click(this.onUpdateNavSection.bind(this));
    this.getTool('removeNavSection').click(this.onRemoveNavSection.bind(this));

    this.getTool('createNavItem').click(this.onCreateNavItem.bind(this));
    this.getTool('updateNavItem').click(this.onUpdateNavItem.bind(this));
    this.getTool('removeNavItem').click(this.onRemoveNavItem.bind(this));

    this.getTool('createNavItemListView').click(this.onCreateNavItemListView.bind(this));
    this.getTool('updateNavItemListView').click(this.onUpdateNavItemListView.bind(this));
    this.getTool('removeNavItemListView').click(this.onRemoveNavItemListView.bind(this));

    this.getTool('createNavListAttr').click(this.onCreateNavListAttr.bind(this));
    this.getTool('updateNavListAttr').click(this.onUpdateNavListAttr.bind(this));
    this.getTool('removeNavListAttr').click(this.onRemoveNavListAttr.bind(this));

    this.getTool('createTask').click(this.onCreateTask.bind(this));
    this.getTool('updateTask').click(this.onUpdateTask.bind(this));
    this.getTool('removeTask').click(this.onRemoveTask.bind(this));
    this.getTool('importTasks').click(this.onImportTasks.bind(this));

    this.getTool('createInterface').click(this.onCreateInterface.bind(this));
    this.getTool('updateInterface').click(this.onUpdateInterface.bind(this));
    this.getTool('removeInterface').click(this.onRemoveInterface.bind(this));

    this.getTool('alignClasses').click(this.onAlignClasses.bind(this));
    this.getTool('alignWorkflowItems').click(this.onAlignWorkflowItems.bind(this));

    this.getTool('classMode').click(this.onClassMode.bind(this));
    this.getTool('viewMode').click(this.onViewMode.bind(this));
    this.getTool('printViewMode').click(this.onPrintViewMode.bind(this));
    this.getTool('workflowViewMode').click(this.onWorkflowViewMode.bind(this));
    this.getTool('workflowMode').click(this.onWorkflowMode.bind(this));

    this.$selectClassView = this.getTool('selectClassView');
    this.$selectClassView.change(this.onSelectClassView.bind(this));

    this.getTool('selectWorkflowViewClass').change(this.onSelectWorkflowViewClass.bind(this));
    this.getTool('selectWorkflowViewState').change(this.onSelectWorkflowViewState.bind(this));

    this.getTool('help').click(this.onHelp.bind(this));

    this.getTool('updateDeploy').click(this.onUpdateDeploy.bind(this));
    this.getTool('updateDeployGlobal').click(this.onUpdateDeployGlobal.bind(this));

    this.getTool('createDeployGlobalModuleTitle').click(this.onCreateDeployGlobalModuleTitle.bind(this));
    this.getTool('updateDeployGlobalModuleTitle').click(this.onUpdateDeployGlobalModuleTitle.bind(this));
    this.getTool('removeDeployGlobalModuleTitle').click(this.onRemoveDeployGlobalModuleTitle.bind(this));

    this.getTool('createDeployGlobalTopMenu').click(this.onCreateDeployGlobalTopMenu.bind(this));
    this.getTool('updateDeployGlobalTopMenu').click(this.onUpdateDeployGlobalTopMenu.bind(this));
    this.getTool('removeDeployGlobalTopMenu').click(this.onRemoveDeployGlobalTopMenu.bind(this));

    this.getTool('createDeployGlobalPlugin').click(this.onCreateDeployGlobalPlugin.bind(this));
    this.getTool('updateDeployGlobalPlugin').click(this.onUpdateDeployGlobalPlugin.bind(this));
    this.getTool('removeDeployGlobalPlugin').click(this.onRemoveDeployGlobalPlugin.bind(this));

    this.getTool('createDeployGlobalJob').click(this.onCreateDeployGlobalJob.bind(this));
    this.getTool('updateDeployGlobalJob').click(this.onUpdateDeployGlobalJob.bind(this));
    this.getTool('removeDeployGlobalJob').click(this.onRemoveDeployGlobalJob.bind(this));

    this.getTool('createDeployModule').click(this.onCreateDeployModule.bind(this));
    this.getTool('updateDeployModule').click(this.onUpdateDeployModule.bind(this));
    this.getTool('removeDeployModule').click(this.onRemoveDeployModule.bind(this));

    this.getSections().hide();
  },

  initListeners: function () {
    var changeActiveItem = this.onChangeActiveItem.bind(this);
    this.studio.events.on('changeActiveItem', changeActiveItem);
    this.studio.events.on('changeContentMode', changeActiveItem);
    this.studio.events.on('createNavItem', changeActiveItem); // redraw tools
    this.studio.events.on('updateNavItem', changeActiveItem);
    this.studio.events.on('createNavItemListView', changeActiveItem);
    this.studio.events.on('removeNavItemListView', changeActiveItem);

    this.studio.events.on('createClassView', this.afterCreateClassView.bind(this));
    this.studio.events.on('updateClassView', this.afterUpdateClassView.bind(this));
    this.studio.events.on('removeClassView', this.afterRemoveClassView.bind(this));
  },

  getSection: function (id) {
    return this.getSections().filter('[data-id="'+ id +'"]');
  },

  getSections: function () {
    if (!arguments.length) {
      return this.$toolbar.find('.toolbar-section');
    }
    var $items = this.getSection(arguments[0]);
    for (let i = 1; i < arguments.length; ++i) {
      $items = $items.add(this.getSection(arguments[i]));
    }
    return $items;
  },

  getTool: function (action) {
    return this.$toolbar.find('[data-action="'+ action +'"]');
  },

  getTools: function () {
    if (!arguments.length) {
      return this.$toolbar.find('[data-action]');
    }
    var $tools = this.getTool(arguments[0]);
    for (let i = 1; i < arguments.length; ++i) {
      $tools = $tools.add(this.getTool(arguments[i]));
    }
    return $tools;
  },

  onChangeActiveItem: function () {
    this.showModeTools();
  },

  // SHOW MODE

  showModeTools: function (type) {
    this.$toolbar.show();
    this.getSections().hide();
    this.getSection('uploadApp').show();
    this.getSection('exportApp').toggle(this.studio.canExport());
    this.getTools().show();
    type = type || this.studio.menu.getActiveType();
    switch (this.studio.contentMode) {
      case 'class': return this.showClassModeTools(type);
      case 'nav': return this.showNavModeTools(type);
      case 'listView': return this.showListViewModeTools(type);
      case 'view': return this.showViewModeTools(type);
      case 'printView': return this.showPrintViewModeTools(type);
      case 'workflow': return this.showWorkflowModeTools(type);
      case 'workflowView': return this.showWorkflowViewModeTools(type);
      case 'task': return this.showTaskModeTools(type);
      case 'interface': return this.showInterfaceModeTools(type);
      case 'deploy': return this.showDeployModeTools(type);
      case 'deployGlobal': return this.showDeployGlobalModeTools(type);
      case 'deployGlobalModuleTitle': return this.showDeployGlobalModuleTitleModeTools(type);
      case 'deployGlobalTopMenu': return this.showDeployGlobalTopMenuModeTools(type);
      case 'deployGlobalPlugin': return this.showDeployGlobalPluginModeTools(type);
      case 'deployGlobalJob': return this.showDeployGlobalJobModeTools(type);
      case 'deployModules': return this.showDeployModulesModeTools(type);
      case 'deployModule': return this.showDeployModuleModeTools(type);
    }
  },

  showClassModeTools: function (activeType) {
    switch (activeType) {
      case undefined:
        this.getSection('app').show();
        this.getTools('updateApp', 'removeApp').hide();
        break;
      case 'app':
        this.getSection('app').show();
        break;
      case 'classes':
        this.getTools('cloneClass', 'updateClass', 'removeClass').hide();
        this.getSections('class', 'util').show();
        this.getTool('alignClasses').show();
        break;
      case 'class':
        this.getTools('updateClassAttr', 'removeClassAttr').hide();
        this.getSections('class', 'classAttr', 'viewMode').show();
        break;
      case 'classAttr':
        this.getTools('updateClass', 'cloneClass', 'removeClass').hide();
        this.getSections('class', 'classAttr', 'viewMode').show();
        break;
    }
    this.getSection('util').toggle(this.studio.canExport());
  },

  showViewModeTools: function (activeType) {
    switch (activeType) {
      case 'class':
      case 'classAttr':
        this.getSection('classView').show();
        this.createClassViewSelect(this.studio.menu.getActiveClass());
        break;
    }
    this.getSection('classMode').show();
  },

  showPrintViewModeTools: function (activeType) {
    switch (activeType) {
      case 'class':
      case 'classAttr':
        this.getSection('classPrintView').show();
        //this.createClassViewSelect(this.studio.menu.getActiveClass());
        break;
    }
    this.getSection('classMode').show();
  },

  showNavModeTools: function (activeType) {
    switch (activeType) {
      case 'nav':
        this.getSection('navSection').show();
        this.getTools('updateNavSection', 'removeNavSection').hide();
        break;
      case 'navSection':
        this.getSections('navSection', 'navItem').show();
        this.getTools('updateNavItem', 'removeNavItem').hide();
        break;
      case 'navItem':
        this.getSections('navSection', 'navItem').show();
        this.getTools('createNavItem', 'updateNavSection', 'removeNavSection').hide();
        var navItem = this.studio.getActiveNavItem();
        if (navItem && navItem.isGroup()) {
          this.getTool('createNavItem').show();
        }
        break;
    }
  },

  showListViewModeTools: function (activeType) {
    this.showNavModeTools(activeType);
    var navItem = this.studio.getActiveNavItem();
    if (navItem && navItem.getClass()) {
      this.getSection('navItemListView').show();
      if (navItem.getListView()) {
        this.getTool('createNavItemListView').hide();
        this.getSection('navListAttr').show();
      } else {
        this.getTools('updateNavItemListView', 'removeNavItemListView').hide();
      }
    }
  },

  showWorkflowModeTools: function (activeType) {
    switch (activeType) {
      case 'workflows':
        this.getSection('workflow').show();
        this.getTools('cloneWorkflow', 'updateWorkflow', 'removeWorkflow').hide();
        break;
      case 'workflow':
        this.getSections('workflow', 'workflowState', 'workflowViewMode', 'workflowUtil').show();
        this.getTools('updateWorkflowState', 'removeWorkflowState').show();
        break;
      case 'workflowState':
        this.getSections('workflow','workflowState','workflowTransition','workflowViewMode').show();
        this.getTools('updateWorkflow','cloneWorkflow','removeWorkflow','updateWorkflowTransition','removeWorkflowTransition').hide();
        break;
      case 'workflowTransition':
        this.getSections('workflow','workflowState','workflowTransition','workflowViewMode').show();
        this.getTools('updateWorkflow','cloneWorkflow','removeWorkflow','updateWorkflowState','removeWorkflowState').hide();
        break;
    }
  },

  showWorkflowViewModeTools: function (activeType) {
    this.createWorkflowViewClassSelect();
    this.createWorkflowViewStateSelect();
    this.getSection('workflowMode').show();
    var state = this.studio.menu.getActiveWorkflowState();
    if (state) {
      this.getTool('selectWorkflowViewState').val(state.getId()).change();
    }
  },

  showTaskModeTools: function (activeType) {
    switch (activeType) {
      case 'tasks':
        this.getSections('taskUtil', 'task').show();
        this.getTools('updateTask','removeTask').hide();
        break;
      case 'task':
        this.getSection('task').show();
        break;
    }
  },

  showInterfaceModeTools: function (activeType) {
    switch (activeType) {
      case 'interfaces':
        this.getSection('interface').show();
        this.getTools('updateInterface', 'removeInterface').hide();
        break;
      case 'interface':
        this.getSection('interface').show();
        break;
    }
  },

  showDeployModeTools: function () {
    this.getSection('deploy').show();
  },

  showDeployGlobalModeTools: function () {
    this.getSection('deployGlobal').show();
  },

  showDeployGlobalModuleTitleModeTools: function () {
    this.getSection('deployGlobalModuleTitle').show();
  },

  showDeployGlobalTopMenuModeTools: function () {
    this.getSection('deployGlobalTopMenu').show();
  },

  showDeployGlobalPluginModeTools: function () {
    this.getSection('deployGlobalPlugin').show();
  },

  showDeployGlobalJobModeTools: function () {
    this.getSection('deployGlobalJob').show();
  },

  showDeployModulesModeTools: function () {
    this.getSection('deployModules').show();
  },

  showDeployModuleModeTools: function () {
    this.getSection('deployModule').show();
  },

  alertNotice: function (message) {
    if (message) {
      this.studio.alert.notice(message);
    }
  },

  // MODEL

  updateModel: function (model, action, form) {
    var $tool = this.getTool(action);
    model ? form.update(model)
          : this.alertNotice($tool.data('selectMessage'));
  },

  removeModel: function (model, action) {
    var $tool = this.getTool(action);
    if (!model) {
      this.alertNotice($tool.data('selectMessage'));
    } else if (Helper.confirm($tool)) {
      model.remove();
    }
  },

  // APP

  onCreateApp: function () {
    this.studio.appForm.create();
  },

  onUpdateApp: function () {
    this.updateModel(this.studio.getActiveApp(), 'updateApp', this.studio.appForm);
  },

  onRemoveApp: function () {
    this.removeModel(this.studio.getActiveApp(), 'removeApp');
  },

  onDownloadApp: function () {
    var $tool = this.getTool('downloadApp');
    var app = this.studio.getActiveApp();
    app ? (new Studio.AppDownload(app)).download()
        : this.alertNotice($tool.data('selectMessage'));
  },

  onUploadApp: function (event) {
    Helper.resetFormElement(this.$appFile);
    this.$appFile.click();
  },

  onChangeAppFile: function (event) {
    (new Studio.AppUpload(this.$appFile.get(0).files, this.studio)).execute();
  },

  onExportApp: function (event) {
    this.studio.exportForm.show(this.studio.getActiveApp());
  },

  // CLASS

  onCreateClass: function () {
    this.studio.classForm.create(this.studio.getActiveApp());
  },

  onCloneClass: function () {
    var source = this.studio.getActiveClass();
    if (source && Helper.confirm($(event.currentTarget))) {
      var model = source.clone();
      this.studio.triggerCreateClass(model);
      this.updateModel(model, 'updateClass', this.studio.classForm);
    }
  },

  onUpdateClass: function () {
    this.updateModel(this.studio.getActiveClass(), 'updateClass', this.studio.classForm);
  },

  onRemoveClass: function () {
    this.removeModel(this.studio.getActiveClass(), 'removeClass');
  },

  // CLASS ATTR

  onCreateClassAttr: function () {
    this.studio.classAttrForm.create(this.studio.getActiveClass());
  },

  onUpdateClassAttr: function () {
    this.updateModel(this.studio.getActiveClassAttr(), 'updateClassAttr', this.studio.classAttrForm);
  },

  onRemoveClassAttr: function () {
    const model = this.studio.getActiveClassAttr();
    if (model && model.isKey()) {
      return this.studio.alert.warning(Helper.L10n.translate('Cannot remove class key attribute'));
    }
    this.removeModel(model, 'removeClassAttr');
  },

  // CLASS VIEW

  getActiveClassViewId: function () {
    return this.$selectClassView.val();
  },

  onSelectClassView: function () {
    const state = !!this.$selectClassView.val();
    this.getSection('classViewAttr').toggle(state);
    this.getSection('classViewGroup').toggle(state);
    this.studio.triggerSelectClassView();
  },

  onCreateClassView: function () {
    this.studio.classViewForm.create(this.studio.getActiveClass());
  },

  onUpdateClassView: function () {
    this.updateModel(this.studio.getActiveClassView(), 'updateClassView', this.studio.classViewForm);
  },

  onRemoveClassView: function () {
    this.removeModel(this.studio.getActiveClassView(), 'removeClassView');
  },

  afterCreateClassView: function (event, model) {
    this.createClassViewSelect(model.cls);
    this.$selectClassView.val(model.id);
  },

  afterUpdateClassView: function (event, model) {
    this.createClassViewSelect(model.cls);
    this.$selectClassView.val(model.id);
  },

  afterRemoveClassView: function (event, model) {
    this.createClassViewSelect(model.cls);
  },

  createClassViewSelect: function (model) {
    var value = this.$selectClassView.val();
    this.$selectClassView.html(Helper.Html.createSelectItems({
      hasEmpty: false,
      items: model.views.map(function (model) {
        return {
          'value': model.id,
          'text': Helper.L10n.translate(model.getTitle(), 'view')
        };
      })
    })).val(value).change();
  },

  // CLASS VIEW ATTR

  onCreateClassViewAttr: function (event, classAttr) {
    this.studio.classViewAttrForm.create(this.studio.getActiveClassView(), classAttr);
  },

  onUpdateClassViewAttr: function () {
    this.updateModel(this.studio.getActiveClassViewAttr(), 'updateClassViewAttr', this.studio.classViewAttrForm);
  },

  onRemoveClassViewAttr: function () {
    this.removeModel(this.studio.getActiveClassViewAttr(), 'removeClassViewAttr');
  },

  onAppendAllClassAttrs: function () {
    this.studio.viewMaker.appendAllClassAttrs();
  },

  // CLASS VIEW GROUP

  onCreateClassViewGroup: function () {
    this.studio.classViewGroupForm.create(this.studio.getActiveClassView());
  },

  onUpdateClassViewGroup: function () {
    this.updateModel(this.studio.getActiveClassViewGroup(), 'updateClassViewGroup', this.studio.classViewGroupForm);
  },

  onRemoveClassViewGroup: function () {
    this.removeModel(this.studio.getActiveClassViewGroup(), 'removeClassViewGroup');
  },

  // CLASS PRINT VIEW

  getActiveClassPrintViewId: function () {
    return this.$selectClassPrintView.val();
  },

  onSelectClassPrintView: function () {
    var state = !!this.$selectClassPrintView.val();
    this.getSection('classViewAttr').toggle(state);
    this.getSection('classViewGroup').toggle(state);
    this.studio.triggerSelectClassView();
  },

  onCreateClassPrintView: function () {
    this.studio.classPrintViewForm.create(this.studio.getActiveClass());
  },

  onUpdateClassPrintView: function () {
    this.updateModel(this.studio.getActiveClassPrintView(), 'updateClassPrintView', this.studio.classPrintViewForm);
  },

  onRemoveClassPrintView: function () {
    this.removeModel(this.studio.getActiveClassPrintView(), 'removeClassPrintView');
  },

  afterCreateClassPrintView: function (event, model) {
    this.createClassViewSelect(model.cls);
    this.$selectClassView.val(model.id);
  },

  afterUpdateClassPrintView: function (event, model) {
    this.createClassViewSelect(model.cls);
    this.$selectClassView.val(model.id);
  },

  afterRemoveClassPrintView: function (event, model) {
    this.createClassViewSelect(model.cls);
  },

  createClassPrintViewSelect: function (model) {
    var value = this.$selectClassView.val();
    this.$selectClassView.html(Helper.Html.createSelectItems({
      hasEmpty: false,
      items: model.views.map(function (model) {
        return {
          'value': model.id,
          'text': Helper.L10n.translate(model.getTitle(), 'view')
        };
      })
    })).val(value).change();
  },

  // WORKFLOW

  onCreateWorkflow: function () {
    this.studio.workflowForm.create(this.studio.getActiveApp());
  },

  onCloneWorkflow: function () {
    var source = this.studio.getActiveWorkflow();
    if (source && Helper.confirm($(event.currentTarget))) {
      var model = source.clone();
      this.studio.triggerCreateWorkflow(model);
      this.updateModel(model, 'updateWorkflow', this.studio.workflowForm);
    }
  },

  onUpdateWorkflow: function () {
    this.updateModel(this.studio.getActiveWorkflow(), 'updateWorkflow', this.studio.workflowForm);
  },

  onRemoveWorkflow: function () {
    this.removeModel(this.studio.getActiveWorkflow(), 'removeWorkflow');
  },

  // WORKFLOW STATE

  onCreateWorkflowState: function () {
    this.studio.workflowStateForm.create(this.studio.getActiveWorkflow());
  },

  onUpdateWorkflowState: function () {
    this.updateModel(this.studio.getActiveWorkflowState(), 'updateWorkflowState', this.studio.workflowStateForm);
  },

  onRemoveWorkflowState: function () {
    this.removeModel(this.studio.getActiveWorkflowState(), 'removeWorkflowState');
  },

  // WORKFLOW TRANSITION

  onCreateWorkflowTransition: function () {
    this.studio.workflowTransitionForm.create(this.studio.getActiveWorkflowState());
  },

  onUpdateWorkflowTransition: function () {
    this.updateModel(this.studio.getActiveWorkflowTransition(), 'updateWorkflowTransition', this.studio.workflowTransitionForm);
  },

  onRemoveWorkflowTransition: function () {
    this.removeModel(this.studio.getActiveWorkflowTransition(), 'removeWorkflowTransition');
  },
  // NAV SECTION

  onCreateNavSection: function () {
    this.studio.navSectionForm.create(this.studio.getActiveApp());
  },

  onUpdateNavSection: function () {
    this.updateModel(this.studio.getActiveNavSection(), 'updateNavSection', this.studio.navSectionForm);
  },

  onRemoveNavSection: function () {
    this.removeModel(this.studio.getActiveNavSection(), 'removeNavSection');
  },

  // NAV ITEM

  onCreateNavItem: function () {
    var parent = this.studio.getActiveNav();
    if (parent instanceof Studio.NavItemModel && !parent.isGroup()) {
      return this.studio.alert.warning(Helper.L10n.translate('Cannot be created in a non-group item'));
    }
    this.studio.navItemForm.create(parent);
  },

  onUpdateNavItem: function () {
    this.updateModel(this.studio.getActiveNavItem(), 'updateNavItem', this.studio.navItemForm);
  },

  onRemoveNavItem: function () {
    this.removeModel(this.studio.getActiveNavItem(), 'removeNavItem');
  },

  // NAV ITEM LIST VIEW

  onCreateNavItemListView: function (event) {
    this.studio.navItemListViewForm.create(this.studio.getActiveNavItem());
  },

  onUpdateNavItemListView: function () {
    this.updateModel(this.studio.getActiveNavItem().getListView(), 'updateNavItemListView', this.studio.navItemListViewForm);
  },

  onRemoveNavItemListView: function () {
    var item = this.studio.getActiveNavItem();
    if (item && Helper.confirm(this.getTool('removeNavItemListView'))) {
      var model = item.getListView();
      item.removeListView();
      this.studio.triggerModelChanging('removeNavItemListView', model);
      this.showModeTools();
    }
  },

  // NAV LIST ATTR

  onCreateNavListAttr: function (event, classAttr) {
    this.studio.classViewAttrForm.create(this.studio.getActiveClassView(), classAttr);
  },

  onUpdateNavListAttr: function () {
    this.updateModel(this.studio.getActiveClassViewAttr(), 'updateClassViewAttr', this.studio.classViewAttrForm);
  },

  onRemoveNavListAttr: function () {
    this.removeModel(this.studio.getActiveClassViewAttr(), 'removeClassViewAttr');
  },

  // TASK

  onCreateTask: function () {
    this.studio.taskForm.create(this.studio.getActiveApp());
  },

  onUpdateTask: function () {
    this.updateModel(this.studio.getActiveTask(), 'updateTask', this.studio.taskForm);
  },

  onRemoveTask: function () {
    this.removeModel(this.studio.getActiveTask(), 'removeTask');
  },

  onImportTasks: function () {
    this.studio.importTaskForm.show(this.studio.getActiveApp());
  },

  // INTERFACE

  onCreateInterface: function () {
    this.studio.interfaceForm.create(this.studio.getActiveApp());
  },

  onUpdateInterface: function () {
    this.updateModel(this.studio.getActiveInterface(), 'updateInterface', this.studio.interfaceForm);
  },

  onRemoveInterface: function () {
    this.removeModel(this.studio.getActiveInterface(), 'removeInterface');
  },

  // UTIL

  onAlignClasses: function (event) {
    var $tool = $(event.currentTarget);
    if (!Helper.confirm($tool)) {
      return false;
    }
    this.studio.toggleLoader(true);
    setTimeout(function () {
      var app = this.studio.getActiveApp();
      var data = this.studio.classUml.getAlignmentData('class', app);
      data = (new Studio.Alignment(data)).execute();
      this.studio.classUml.setAlignmentData(data, 'class', app);
      this.studio.toggleLoader(false);
    }.bind(this), 10);
  },

  onAlignWorkflowItems: function (event) {
    var $tool = $(event.currentTarget);
    if (!Helper.confirm($tool)) {
      return false;
    }
    this.studio.toggleLoader(true);
    setTimeout(function () {
      var workflow = this.studio.getActiveWorkflow();
      var data = this.studio.workflowUml.getAlignmentData(workflow);
      data = (new Studio.Alignment(data)).execute();
      this.studio.workflowUml.setAlignmentData(data, workflow);
      this.studio.toggleLoader(false);
    }.bind(this), 10);
  },

  onClassMode: function () {
    this.studio.setContentMode('class');
  },

  onViewMode: function () {
    this.studio.setContentMode('view');
  },

  onPrintViewMode: function () {
    this.studio.setContentMode('printView');
  },

  onWorkflowViewMode: function () {
    if (this.studio.getActiveWorkflow().getClass()) {
      this.studio.setContentMode('workflowView');
    }
  },

  onWorkflowMode: function () {
    this.studio.setContentMode('workflow');
  },

  // WORKFLOW VIEW

  createWorkflowViewClassSelect: function () {
    var wf = this.studio.menu.getActiveWorkflow();
    var cls = wf.getClass();
    var classes = [cls].concat(cls.getDescendants());
    var content = Helper.Html.createSelectItems({
      'hasEmpty': false,
      'items': classes.map(function (item) {
        return {
          'value': item.getId(),
          'text': item.getTitle()
        };
      })
    });
    this.getSection('workflowViewClass').show();
    this.getTool('selectWorkflowViewClass').html(content);
  },

  createWorkflowViewStateSelect: function (workflow) {
    var wf = this.studio.menu.getActiveWorkflow();
    var content = Helper.Html.createSelectItems({
      'items': wf.states.map(function (state) {
        return {
          'value': state.getId(),
          'text': state.getTitle()
        };
      })
    });
    this.getSection('workflowViewState').show();
    this.getTool('selectWorkflowViewState').html(content);
  },

  getActiveWorkflowViewClass: function () {
    return this.studio.getActiveWorkflow().app.getClass(this.getTool('selectWorkflowViewClass').val());
  },

  getActiveWorkflowViewState: function () {
    return this.studio.getActiveWorkflow().getState(this.getTool('selectWorkflowViewState').val());
  },

  getActiveWorkflowView: function () {
    var state = this.getActiveWorkflowViewState();
    return state && state.getView(this.getActiveWorkflowViewClass());
  },

  onSelectWorkflowViewClass: function () {
    this.getTool('selectWorkflowViewState').change();
    // this.studio.triggerSelectWorkflowViewClass(this.getActiveWorkflowViewClass());
  },

  onSelectWorkflowViewState: function () {
    var state = this.getActiveWorkflowViewState();
    this.getSection('workflowView').toggle(!!state);
    this.getSection('workflowViewAttr').toggle(!!state);
    this.getSection('workflowViewGroup').toggle(!!state);
    this.studio.triggerSelectWorkflowViewState(state);
  },

  onUpdateWorkflowView: function () {
    this.updateModel(this.getActiveWorkflowView(), 'updateWorkflowView', this.studio.classViewForm);
  },

  onRemoveWorkflowView: function () {
    var view = this.getActiveWorkflowView();
    var $tool = this.getTool('removeWorkflowView');
    if (!view) {
      this.alertNotice($tool.data('selectMessage'));
    } else if (Helper.confirm($tool)) {
      this.getActiveWorkflowState.removeView(view);
    }
  },

  onCreateWorkflowViewAttr: function (event, classAttr) {
    this.studio.classViewAttrForm.create(this.getActiveWorkflowView(), classAttr);
  },

  onUpdateWorkflowViewAttr: function () {
    this.updateModel(this.studio.getActiveWorkflowViewAttr(), 'updateWorkflowViewAttr', this.studio.classViewAttrForm);
  },

  onRemoveWorkflowViewAttr: function () {
    this.removeModel(this.studio.getActiveWorkflowViewAttr(), 'removeWorkflowViewAttr');
  },

  onAppendAllWorkflowAttrs: function () {
    this.studio.workflowViewMaker.appendAllClassAttrs();
  },

  onCreateWorkflowViewGroup: function () {
    this.studio.classViewGroupForm.create(this.getActiveWorkflowView());
  },

  onUpdateWorkflowViewGroup: function () {
    this.updateModel(this.studio.getActiveWorkflowViewGroup(), 'updateWorkflowViewGroup', this.studio.classViewGroupForm);
  },

  onRemoveWorkflowViewGroup: function () {
    this.removeModel(this.studio.getActiveWorkflowViewGroup(), 'removeWorkflowViewGroup');
  },

  onHelp: function () {
    (Helper.L10n.getLanguage() === 'ru' ? this.studio.modalHelpRu : this.studio.modalHelp).show();
  },

  // DEPLOY

  onUpdateDeploy: function () {
    this.updateModel(this.studio.getActiveDeploy(), 'updateDeploy', this.studio.deployForm);
  },

  onUpdateDeployGlobal: function () {
    this.updateModel(this.studio.getActiveDeployGlobal(), 'updateDeployGlobal', this.studio.deployGlobalForm);
  },

  // DEPLOY GLOBAL MODULE TITLE

  onCreateDeployGlobalModuleTitle: function () {
    this.studio.deployGlobalModuleTitleForm.create(this.studio.getActiveApp());
  },

  onUpdateDeployGlobalModuleTitle: function () {
    this.updateModel(this.studio.getActiveDeployGlobalModuleTitle(), 'updateDeployGlobalModuleTitle', this.studio.deployGlobalModuleTitleForm);
  },

  onRemoveDeployGlobalModuleTitle: function () {
    this.removeModel(this.studio.getActiveDeployGlobalModuleTitle(), 'removeDeployGlobalModuleTitle');
  },

  // DEPLOY GLOBAL MENU

  onCreateDeployGlobalTopMenu: function () {
    this.studio.deployGlobalTopMenuForm.create(this.studio.getActiveApp());
  },

  onUpdateDeployGlobalTopMenu: function () {
    this.updateModel(this.studio.getActiveDeployGlobalTopMenu(), 'updateDeployGlobalTopMenu', this.studio.deployGlobalTopMenuForm);
  },

  onRemoveDeployGlobalTopMenu: function () {
    this.removeModel(this.studio.getActiveDeployGlobalTopMenu(), 'removeDeployGlobalTopMenu');
  },

  // DEPLOY GLOBAL PLUGIN

  onCreateDeployGlobalPlugin: function () {
    this.studio.deployGlobalPluginForm.create(this.studio.getActiveApp());
  },

  onUpdateDeployGlobalPlugin: function () {
    this.updateModel(this.studio.getActiveDeployGlobalPlugin(), 'updateDeployGlobalPlugin', this.studio.deployGlobalPluginForm);
  },

  onRemoveDeployGlobalPlugin: function () {
    this.removeModel(this.studio.getActiveDeployGlobalPlugin(), 'removeDeployGlobalPlugin');
  },

  // DEPLOY GLOBAL JOB

  onCreateDeployGlobalJob: function () {
    this.studio.deployGlobalJobForm.create(this.studio.getActiveApp());
  },

  onUpdateDeployGlobalJob: function () {
    this.updateModel(this.studio.getActiveDeployGlobalJob(), 'updateDeployGlobalJob', this.studio.deployGlobalJobForm);
  },

  onRemoveDeployGlobalJob: function () {
    this.removeModel(this.studio.getActiveDeployGlobalJob(), 'removeDeployGlobalJob');
  },

  // DEPLOY MODULE

  onCreateDeployModule: function () {
    this.studio.deployModuleForm.create(this.studio.getActiveApp());
  },

  onUpdateDeployModule: function () {
    var module = this.studio.getActiveDeployModule();
    this.updateModel(module, 'updateDeployModule', this.studio.getDeployModuleForm(module));
  },

  onRemoveDeployModule: function () {
    this.removeModel(this.studio.getActiveDeployModule(), 'removeDeployModule');
  },
});