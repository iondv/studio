"use strict";

Studio.SidebarMenu = function ($menu, studio) {
  this.$menu = $menu;
  this.studio = studio;
  this.events = new Helper.Events('sidebarMenu:');
};

$.extend(Studio.SidebarMenu.prototype, {

  initListeners: function () {

    this.studio.events.on('createApp', this.onCreateApp.bind(this));
    this.studio.events.on('createClass', this.onCreateClass.bind(this));
    this.studio.events.on('createClassAttr', this.onCreateClassAttr.bind(this));
    this.studio.events.on('createWorkflow', this.onCreateWorkflow.bind(this));
    this.studio.events.on('createWorkflowState', this.onCreateWorkflowState.bind(this));
    this.studio.events.on('createWorkflowTransition', this.onCreateWorkflowTransition.bind(this));
    this.studio.events.on('updateWorkflowTransition', this.onUpdateWorkflowTransition.bind(this));
    this.studio.events.on('createNavSection', this.onCreateNavSection.bind(this));
    this.studio.events.on('createNavItem', this.onCreateNavItem.bind(this));
    this.studio.events.on('updateNavItem', this.onUpdateNavItem.bind(this));
    this.studio.events.on('removeNavItem', this.onRemoveNavItem.bind(this));
    this.studio.events.on('createTask', this.onCreateTask.bind(this));
    this.studio.events.on('createInterface', this.onCreateInterface.bind(this));

    this.studio.events.on('updateModel', this.onUpdateModel.bind(this));
    this.studio.events.on('removeModel', this.onRemoveModel.bind(this));

    this.$menu.on('click', '.menu-item-icon', this.onItemIcon.bind(this));
    this.$menu.on('click', '.menu-item-title', this.onItemTitle.bind(this));
    this.$menu.on('dblclick', '.menu-item-title', this.onDoubleClickModel.bind(this));
  },

  getModelByItem: function ($item) {
    switch ($item.data('type')) {
      case 'app': return this.getAppByItem($item);
      case 'class': return this.getClassByItem($item);
      case 'classAttr': return this.getClassAttrByItem($item);
      case 'workflow': return this.getWorkflowByItem($item);
      case 'workflowState': return this.getWorkflowStateByItem($item);
      case 'workflowTransition': return this.getWorkflowTransitionByItem($item);
      case 'navSection': return this.getNavSectionByItem($item);
      case 'navItem': return this.getNavItemByItem($item);
      case 'task': return this.getTaskByItem($item);
      case 'interface': return this.getInterfaceByItem($item);
    }
  },

  getClosestByType: function (type, $item) {
    return $item.closest('[data-type="'+ type +'"]');
  },

  getItemHead: function ($item) {
    return $item.children('.menu-item-head');
  },

  getItem: function (id) {
    return this.$menu.find('[data-id="'+ id +'"]');
  },

  getItemByElement: function (element) {
    return $(element).closest('.menu-item');
  },

  getItemByType: function (type, $parent) {
    return ($parent || this.$menu).find('[data-type="'+ type +'"]');
  },

  getChildren: function ($item) {
    return $item.children('.menu-item-children');
  },

  toggleOpen: function ($item, state) {
    $item.toggleClass('open', state);
  },

  rebuild: function () {
    this.$menu.empty();
    this.studio.apps.forEach(this.createApp, this);
  },

  createItem: function (data) {
    data.cssClass = data.cssClass || '';
    data.cssClass += data.hasChildren ? ' has-children' : '';
    return this.studio.renderSample('studio-sidebar-menu-item', data);
  },

  onItemIcon: function (event) {
    this.toggleOpen(this.getItemByElement(event.currentTarget));
  },

  onItemTitle: function (event) {
    var $item = this.getItemByElement(event.currentTarget);
    var active = this.isActiveItem($item);
    if (active) {
      return this.toggleOpen($item, true);
    }
    this.activate($item);
  },

  onDoubleClickModel: function (event) {
    this.updateByItem(this.getItemByElement(event.currentTarget));
  },

  updateByItem: function ($item) {
    var model = this.getModelByItem($item);
    if (model) {
      switch (model.constructor) {
        case Studio.AppModel: this.studio.appForm.update(model); break;
        case Studio.ClassModel: this.studio.classForm.update(model); break;
        case Studio.ClassAttrModel: this.studio.classAttrForm.update(model); break;
        case Studio.WorkflowModel: this.studio.workflowForm.update(model); break;
        case Studio.WorkflowStateModel: this.studio.workflowStateForm.update(model); break;
        case Studio.WorkflowTransitionModel: this.studio.workflowTransitionForm.update(model); break;
        case Studio.NavSectionModel: this.studio.navSectionForm.update(model); break;
        case Studio.NavItemModel: this.studio.navItemForm.update(model); break;
        case Studio.TaskModel: this.studio.taskForm.update(model); break;
        case Studio.InterfaceModel: this.studio.interfaceForm.update(model); break;
      }
    }
  },

  // CONTENT MODE

  setValidContentMode: function ($item) {
    var type = $item.data('type');
    var mode = this.getValidContentModeByType(type, this.getModelByItem($item));
    this.toggleAppActive($item);
    this.studio.setContentMode(mode);
  },

  getValidContentModeByType: function (type, model) {
    var modes;
    switch (type) {
      case 'class':
      case 'classAttr':
        modes = ['class', 'view', 'printView'];
        break;
      case 'nav':
      case 'navSection':
        modes = ['nav'];
        break;
      case 'navItem':
        if (model.isClassPage()) {
          modes = ['listView'];
        } else {
          modes = ['nav'];
        }
        break;
      case 'tasks':
      case 'task':
        modes = ['task'];
        break;
      case 'workflows':
        modes = ['workflow'];
        break;
      case 'workflow':
      case 'workflowState':
      case 'workflowTransition':
        modes = ['workflow', 'workflowView'];
        break;
      case 'interfaces':
      case 'interface':
        modes = ['interface'];
        break;
      case 'changelog':
        modes = ['changelog'];
        break;
      default:
        modes = ['class'];
    }
    return modes && modes.indexOf(this.studio.contentMode) === -1
        ? modes[0]
        : this.studio.contentMode;
  },

  // ACTIVE

  isActiveItem: function ($item) {
    return $item.hasClass('active');
  },

  getActiveParent: function () {
    return this.getItemByElement(this.getActive().parent());
  },

  getActiveType: function () {
    return this.getActive().data('type');
  },

  getActive: function () {
    return this.$menu.find('.active');
  },

  getActiveId: function () {
    return this.getActive().data('id');
  },

  deactivate: function () {
    this.toggleActive(this.getActive(), false);
  },

  toggleActive: function ($item, state) {
    $item.toggleClass('active', state);
    this.studio.triggerChangeActiveItem();
  },

  activateById: function (id) {
    this.activate(this.getItem(id));
  },

  activate: function ($item) {
    this.deactivate();
    this.toggleActive($item, true);
    this.toggleOpen($item, true);
    this.setValidContentMode($item);
  },

  setActiveFirstApp: function () {
    this.activate(this.getItemByType('app', this.$menu).first());
  },

  openActiveItemParent: function () {
    this.getActive().parent().closest('.has-children').addClass('open');
  },

  toggleAppActive: function ($item) {
    if ($item.data('type') === 'app') {
      this.getItemByType('app').removeClass('active-app');
      $item.addClass('active-app');
      setTimeout(function () {
        this.activate(this.getItemByType('classes', $item));
      }.bind(this), 0);
    }
  },

  // MODEL

  getActiveModel: function () {
    var $item = this.getActive();
    var type = this.getActive().data('type');
    switch (type) {
      case 'classAttr': return this.getClassAttrByItem($item);
      case 'class': return this.getClassByItem($item);
    }
    return this.getAppByItem($item);
  },

  onUpdateModel: function (event, model) {
    Helper.updateTemplate('update-id', this.getItemHead(this.getItem(model.id)), {
      'title': model.getTitle()
    });
  },

  onRemoveModel: function (event, model) {
    var $item = this.getItem(model.id);
    if ($item.length) {
      var $parent = this.getActiveParent();
      $item.remove();
      this.activate($parent);
    }
  },

  // APP

  getActiveApp: function () {
    return this.getAppByItem(this.getActive());
  },

  getAppByItem: function ($item) {
    $item = this.getClosestByType('app', $item);
    return this.studio.getApp($item.data('id'));
  },

  onCreateApp: function (event, model) {
    this.createApp(model);
    this.activate(this.getItem(model.id));
  },

  createApp: function (model) {
    this.$menu.append(this.createItem({
      'type': 'app',
      'id': model.id,
      'title': model.getTitle(),
      'hasChildren': true,
      'children': this.createAppSections(model)
    }));
  },

  createAppSections: function (model) {
    return [{
      'type': 'classes',
      'title': Helper.L10n.translate('Classes'),
      'children': this.createClasses(model)
    },{
      'type': 'nav',
      'title': Helper.L10n.translate('Navigation'),
      'children': this.createNavSections(model)
    },{
      'type': 'workflows',
      'title': Helper.L10n.translate('Workflows'),
      'children': this.createWorkflows(model)
    },/*{
      'type': 'tasks',
      'title': Helper.L10n.translate('Task manager'),
      'children': this.createTasks(model)
    },*/{
      'type': 'interfaces',
      'title': Helper.L10n.translate('Interface constructor'),
      'children': this.createInterfaces(model)
    }, {
      'type': 'admin',
      'title': Helper.L10n.translate('Settings'),
      'children': this.createAdmin(model)
    }].map(function (data) {
      return this.createItem(this.getAppSectionParams(data, model));
    }.bind(this)).join('');
  },

  getAppSectionChildren: function (type, app) {
    return this.getItem(app.id).find('[data-type="'+ type +'"]').children('.menu-item-children')
  },

  getAppSectionParams: function (data, app) {
    return Object.assign({
      cssClass: 'app-section',
      hasChildren: data.hasChildren !== false
    }, data);
  },

  // CLASS

  getActiveClass: function () {
    return this.getClassByItem(this.getActive());
  },

  getClassByItem: function ($item) {
    var $class = this.getClosestByType('class', $item);
    var $app = this.getClosestByType('app', $class);
    return this.studio.getClass($class.data('id'), $app.data('id'));
  },

  onCreateClass: function (event, model) {
    var $item = this.getItemByType('classes', this.getItem(model.app.id));
    this.getChildren($item).append(this.createClass(model));
    this.activate(this.getItem(model.id));
  },

  createClasses: function (app) {
    return app.classes.map(function (model) {
      return this.createClass(model);
    }.bind(this)).join('');
  },

  createClass: function (model) {
    return this.createItem({
      'type': 'class',
      'id': model.id,
      'name': model.getName(),
      'title': model.getTitle(),
      'hasChildren': true,
      'children': this.createClassAttrs(model)
    });
  },

  // CLASS ATTR

  getActiveClassAttr: function () {
    return this.getClassAttrByItem(this.getActive());
  },

  getClassAttrByItem: function ($item) {
    var $attr = this.getClosestByType('classAttr', $item);
    var $class = this.getClosestByType('class', $attr);
    var $app = this.getClosestByType('app', $class);
    return this.studio.getClassAttr($attr.data('id'),  $class.data('id'), $app.data('id'));
  },

  onCreateClassAttr: function (event, model) {
    var $item = this.getItem(model.cls.id);
    this.getChildren($item).append(this.createClassAttr(model));
    this.activate(this.getItem(model.id));
  },

  createClassAttrs: function (cls) {
    return cls.attrs.map(function (model) {
      return this.createClassAttr(model);
    }, this).join('');
  },

  createClassAttr: function (model) {
    return this.createItem({
      'type': 'classAttr',
      'id': model.id,
      'name': model.getName(),
      'title': model.getTitle()
    });
  },

  // VIEW

  createViewClasses: function (app) {
    return app.classes.map(function (model) {
      return this.createViewClass(model);
    }, this).join('');
  },

  createViewClass: function (model) {
    return this.createItem({
      'type': 'viewClass',
      'id': model.id,
      'title': model.getTitle(),
      'hasChildren': true,
      'children': this.createClassViews(model)
    });
  },

  createClassViews: function (cls) {
    return cls.views.map(function (model) {
      return this.createClassView(model);
    }, this).join('');
  },

  createClassView: function (model) {
    return this.createItem({
      'type': 'classView',
      'id': model.id,
      'title': model.getTitle()
    });
  },

  // WORKFLOW

  getActiveWorkflow: function () {
    return this.getWorkflowByItem(this.getActive());
  },

  getWorkflowByItem: function ($item) {
    var $workflow = this.getClosestByType('workflow', $item);
    var $app = this.getClosestByType('app', $workflow);
    return this.studio.getWorkflow($workflow.data('id'), $app.data('id'));
  },

  onCreateWorkflow: function (event, model) {
    var $item = this.getItemByType('workflows', this.getItem(model.app.id));
    this.getChildren($item).append(this.createWorkflow(model));
    this.activate(this.getItem(model.id));
  },

  createWorkflows: function (app) {
    return app.workflows.map(function (model) {
      return this.createWorkflow(model);
    }, this).join('');
  },

  createWorkflow: function (model) {
    return this.createItem({
      'type': 'workflow',
      'id': model.id,
      'name': model.getName(),
      'title': model.getTitle(),
      'hasChildren': true,
      'children': this.createWorkflowStates(model)
    });
  },

  // WORKFLOW STATE

  getActiveWorkflowState: function () {
    return this.getWorkflowStateByItem(this.getActive());
  },

  getWorkflowStateByItem: function ($item) {
    var $state = this.getClosestByType('workflowState', $item);
    var $workflow = this.getClosestByType('workflow', $state);
    var $app = this.getClosestByType('app', $workflow);
    return this.studio.getWorkflowState($state.data('id'), $workflow.data('id'), $app.data('id'));
  },

  onCreateWorkflowState: function (event, model) {
    var $item = this.getItem(model.workflow.id);
    this.getChildren($item).append(this.createWorkflowState(model));
    this.activate(this.getItem(model.id));
  },

  createWorkflowStates: function (workflow) {
    return workflow.states.map(function (model) {
      return this.createWorkflowState(model);
    }, this).join('');
  },

  createWorkflowState: function (model) {
    return this.createItem({
      'type': 'workflowState',
      'id': model.id,
      'name': model.getName(),
      'title': model.getTitle(),
      'hasChildren': true,
      'children': this.createWorkflowStateTransitions(model)
    });
  },

  updateWorkflowStates: function (workflow, activeTransition) {
    workflow.states.forEach(function (state) {
      Helper.updateTemplate('update-id', this.getItem(state.id), {
        'title': state.getTitle(),
        'children': this.createWorkflowStateTransitions(state, activeTransition)
      });
    }, this);
  },

  // WORKFLOW TRANSITION

  getActiveWorkflowTransition: function () {
    return this.getWorkflowTransitionByItem(this.getActive());
  },

  getWorkflowTransitionByItem: function ($item) {
    var $transition = this.getClosestByType('workflowTransition', $item);
    var $workflow = this.getClosestByType('workflow', $transition);
    var $app = this.getClosestByType('app', $workflow);
    return this.studio.getWorkflowTransition($transition.data('id'), $workflow.data('id'), $app.data('id'));
  },

  onCreateWorkflowTransition: function (event, model) {
    this.updateWorkflowStates(model.workflow);
    this.activate(this.getItem(model.id));
    this.openActiveItemParent();
  },

  onUpdateWorkflowTransition: function (event, model) {
    this.updateWorkflowStates(model.workflow, model);
    this.openActiveItemParent();
  },

  createWorkflowStateTransitions: function (state, active) {
    return state.getStartTransitions().map(function (model) {
      return this.createWorkflowTransition(model, active);
    }, this).join('');
  },

  createWorkflowTransitions: function (workflow) {
    return workflow.transitions.map(function (model) {
      return this.createWorkflowTransition(model);
    }, this).join('');
  },

  createWorkflowTransition: function (model, active) {
    var cssClass = active && active.id === model.id ? 'active' : '';
    return this.createItem({
      'type': 'workflowTransition',
      'id': model.id,
      'name': model.getName(),
      'title': model.getTitle(),
      'cssClass': cssClass
    });
  },

  // NAV SECTION

  getActiveNavSection: function () {
    return this.getNavSectionByItem(this.getActive());
  },

  getNavSectionByItem: function ($item) {
    var $section = this.getClosestByType('navSection', $item);
    var $app = this.getClosestByType('app', $section);
    return this.studio.getNavSection($section.data('id'), $app.data('id'));
  },

  onCreateNavSection: function (event, model) {
    var $item = this.getItemByType('nav', this.getItem(model.app.id));
    this.getChildren($item).append(this.createNavSection(model));
    this.activate(this.getItem(model.id));
  },

  createNavSections: function (app) {
    return app.navSections.map(function (model) {
      return this.createNavSection(model);
    }, this).join('');
  },

  createNavSection: function (model) {
    return this.createItem({
      'type': 'navSection',
      'id': model.id,
      'name': model.getName(),
      'title': model.getTitle(),
      'hasChildren': true,
      'children': this.createNavItems(model)
    });
  },

  // NAV ITEM

  getActiveNavItem: function () {
    return this.getNavItemByItem(this.getActive());
  },

  getNavItemByItem: function ($item) {
    $item = this.getClosestByType('navItem', $item);
    var $section = this.getClosestByType('navSection', $item);
    var $app = this.getClosestByType('app', $section);
    return this.studio.getNavItem($item.data('id'), $section.data('id'), $app.data('id'));
  },

  getNavItemParentType: function (model) {
    return model.parent instanceof Studio.NavItemModel ? 'navItem' : 'navSection';
  },

  onCreateNavItem: function (event, model) {
    var $item = this.getItem(model.parent.id);
    this.getChildren($item).append(this.createNavItem(model));
    $item.addClass('has-children');
    this.activate(this.getItem(model.id));
  },

  createNavItems: function (parent) {
    var items = Studio.Model.sort(parent.items);
    return items.map(function (model) {
      return this.createNavItem(model);
    }, this).join('');
  },

  createNavItem: function (model) {
    var children = this.createNavItems(model);
    return this.createItem({
      'type': 'navItem',
      'id': model.id,
      'name': model.getName(),
      'title': model.getTitle(),
      'hasChildren': !!children,
      'children': children
    });
  },

  onUpdateNavItem: function (event, model) {
    Helper.updateTemplate('update-id', this.getItemHead(this.getItem(model.id)), {
      'title': model.getTitle()
    });
  },

  onRemoveNavItem: function (event, model) {
    var $parent = this.getActiveParent();
    this.getItem(model.id).remove();
    if ($parent.data('type') === 'navItem') {
      model = this.getModelByItem($parent);
      $parent.toggleClass('has-children', model.getItems().length > 0);
    }
    this.activate($parent);
  },

  // TASK

  getActiveTask: function () {
    return this.getTaskByItem(this.getActive());
  },

  getTaskByItem: function ($item) {
    var $task = this.getClosestByType('task', $item);
    var $app = this.getClosestByType('app', $task);
    return this.studio.getTask($task.data('id'), $app.data('id'));
  },

  onCreateTask: function (event, model) {
    var $item = this.getItemByType('tasks', this.getItem(model.app.id));
    this.getChildren($item).append(this.createTask(model));
    this.activate(this.getItem(model.id));
  },

  createTasks: function (app) {
    return app.tasks.map(function (model) {
      return this.createTask(model);
    }, this).join('');
  },

  createTask: function (model) {
    return this.createItem({
      'type': 'task',
      'id': model.id,
      'name': model.getName(),
      'title': model.getTitle(),
      'hasChildren': false
    });
  },

  updateTasks: function (app) {
    this.getAppSectionChildren('tasks', app).html(this.createTasks(app));
  },

  // INTERFACE

  getActiveInterface: function () {
    return this.getInterfaceByItem(this.getActive());
  },

  getInterfaceByItem: function ($item) {
    var $model = this.getClosestByType('interface', $item);
    var $app = this.getClosestByType('app', $model);
    return this.studio.getInterface($model.data('id'), $app.data('id'));
  },

  onCreateInterface: function (event, model) {
    var $item = this.getItemByType('interfaces', this.getItem(model.app.id));
    this.getChildren($item).append(this.createInterface(model));
    this.activate(this.getItem(model.id));
  },

  createInterfaces: function (app) {
    return app.interfaces.map(function (model) {
      return this.createInterface(model);
    }, this).join('');
  },

  createInterface: function (model) {
    return this.createItem({
      'type': 'interface',
      'id': model.id,
      'name': model.getName(),
      'title': model.getTitle(),
      'hasChildren': false
    });
  },

  updateInterfaces: function (app) {
    this.getAppSectionChildren('interfaces', app).html(this.createInterfaces(app));
  },

  // ADMIN

  createAdmin: function (app) {
    return this.createItem({
      'type': 'changelog',
      'title': Helper.L10n.translate('Changelog')
    });
  }
});