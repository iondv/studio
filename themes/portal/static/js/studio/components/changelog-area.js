"use strict";

Studio.ChangelogArea = function ($container, studio) {
  this.$container = $container;
  this.studio = studio;
  this.menu = studio.menu;
  this.$area = $container.children('.changelog-area');
  this.$table = this.$area.find('.table');
  this.$tbody = this.$table.children('tbody');
  this.createDataTable();
};

$.extend(Studio.ChangelogArea.prototype, {

  initListeners: function () {
    var redraw = this.redraw.bind(this);
    this.studio.events.on('changeContentMode', this.onChangeContentMode.bind(this));
    this.studio.events.on('createClass', this.onCreateClass.bind(this));
    this.studio.events.on('updateClass', this.onUpdateClass.bind(this));
    this.studio.events.on('removeClass', this.onRemoveClass.bind(this));
    this.studio.events.on('createClassAttr', this.onCreateClassAttr.bind(this));
    this.studio.events.on('updateClassAttr', this.onUpdateClassAttr.bind(this));
    this.studio.events.on('removeClassAttr', this.onRemoveClassAttr.bind(this));
    this.studio.events.on('createNavSection', this.onCreateNavSection.bind(this));
    this.studio.events.on('updateNavSection', this.onUpdateNavSection.bind(this));
    this.studio.events.on('removeNavSection', this.onRemoveNavSection.bind(this));
    this.studio.events.on('createNavItem', this.onCreateNavItem.bind(this));
    this.studio.events.on('updateNavItem', this.onUpdateNavItem.bind(this));
    this.studio.events.on('removeNavItem', this.onRemoveNavItem.bind(this));
    this.studio.events.on('createWorkflow', this.onCreateWorkflow.bind(this));
    this.studio.events.on('updateWorkflow', this.onUpdateWorkflow.bind(this));
    this.studio.events.on('removeWorkflow', this.onRemoveWorkflow.bind(this));
    this.studio.events.on('createWorkflowState', this.onCreateWorkflowState.bind(this));
    this.studio.events.on('updateWorkflowState', this.onUpdateWorkflowState.bind(this));
    this.studio.events.on('removeWorkflowState', this.onRemoveWorkflowState.bind(this));
    this.studio.events.on('createWorkflowTransition', this.onCreateWorkflowTransition.bind(this));
    this.studio.events.on('updateWorkflowTransition', this.onUpdateWorkflowTransition.bind(this));
    this.studio.events.on('removeWorkflowTransition', this.onRemoveWorkflowTransition.bind(this));
    this.$tbody.on('click', 'tr', this.onClickRow.bind(this));
    //this.$tbody.on('dblclick', 'tr', this.onDoubleClickRow.bind(this));
  },

  createDataTable: function () {
    this.dt = this.$table.DataTable({
      sDom: "<'row'<'col-sm-6'f><'col-sm-6'l>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
      columns: [{
        data: 'date',
        render: Helper.DataTable.formatTimestamp,
      }, {
        data: 'action',
        orderable: false,
        render: this.translateCell.bind(this)
      },{
        data: 'type',
        orderable: false,
        render: this.translateCell.bind(this)
      },{
        data: 'name',
        orderable: false
      },{
        data: 'oldValue',
        orderable: false,
        searchable: false,
        render: this.formatValues.bind(this)
      },{
        data: 'newValue',
        orderable: false,
        searchable: false,
        render: this.formatValues.bind(this)
      },],
      order: [[0, 'desc']]
    });
  },

  getApp: function () {
    return this.studio.getActiveApp();
  },

  isActive: function () {
    return this.$container.is(':visible');
  },

  getActiveRow: function () {
    return this.$tbody.children('.active');
  },

  toggleActiveRow: function ($row, state) {
    this.getActiveRow().removeClass('active');
    $row.toggleClass('active', state);
  },

  getTaskByRow: function ($row) {
    return this.app.getTask($row.data('id'));
  },

  getRow: function (id) {
    return this.$tbody.children('[data-id="'+ id +'"]');
  },

  // HANDLER

  onChangeContentMode: function (event, mode) {
    this.$container.toggle(mode === 'changelog');
    this.redraw();
  },

  onCreateClassAttr: function (event, model) {
    this.addCreateLog('class attribute', model);
  },

  onUpdateClassAttr: function (event, model) {
    this.addUpdateLog('class attribute', model);
  },

  onRemoveClassAttr: function (event, model) {
    this.addRemoveLog('class attribute', model);
  },

  onCreateClass: function (event, model) {
    this.addCreateLog('class', model);
  },

  onUpdateClass: function (event, model) {
    this.addUpdateLog('class', model);
  },

  onRemoveClass: function (event, model) {
    this.addRemoveLog('class', model);
  },

  onCreateNavSection: function (event, model) {
    this.addCreateLog('nav section', model);
  },

  onUpdateNavSection: function (event, model) {
    this.addUpdateLog('nav section', model);
  },

  onRemoveNavSection: function (event, model) {
    this.addRemoveLog('nav section', model);
  },

  onCreateNavItem: function (event, model) {
    this.addCreateLog('nav item', model);
  },

  onUpdateNavItem: function (event, model) {
    this.addUpdateLog('nav item', model);
  },

  onRemoveNavItem: function (event, model) {
    this.addRemoveLog('nav item', model);
  },

  onClickRow: function (event) {
    var $row = $(event.currentTarget);
    this.toggleActiveRow($row, true);
    // this.menu.activate(this.menu.getItem($row.data('id')));
  },

  onDoubleClickRow: function (event) {
    var $row = $(event.currentTarget);
    //this.menu.updateByItem(this.menu.getItem($row.data('id')));
  },

  onCreateWorkflow: function (event, model) {
    this.addCreateLog('workflow', model);
  },

  onUpdateWorkflow: function (event, model) {
    this.addUpdateLog('workflow', model);
  },

  onRemoveWorkflow: function (event, model) {
    this.addRemoveLog('workflow', model);
  },

  onCreateWorkflowState: function (event, model) {
    this.addCreateLog('workflow state', model);
  },

  onUpdateWorkflowState: function (event, model) {
    this.addUpdateLog('workflow state', model);
  },

  onRemoveWorkflowState: function (event, model) {
    this.addRemoveLog('workflow state', model);
  },

  onCreateWorkflowTransition: function (event, model) {
    this.addCreateLog('workflow transition', model);
  },

  onUpdateWorkflowTransition: function (event, model) {
    this.addUpdateLog('workflow transition', model);
  },

  onRemoveWorkflowTransition: function (event, model) {
    this.addRemoveLog('workflow transition', model);
  },

  // LOG

  addCreateLog: function (type, model) {
    this.addLog('create', type, model);
  },

  addUpdateLog: function (type, model) {
    var keys = model.getChangedKeys();
    if (keys.length) {
      var oldData = Helper.Object.intersectByKeys(model.oldData, keys);
      var newData = Helper.Object.intersectByKeys(model.data, keys);
      this.addLog('update', type, model, oldData, newData);
    }
  },

  addRemoveLog: function (type, model) {
    this.addLog('remove', type, model);
  },

  addLog: function (action, type, model, oldData, newData) {
    this.getApp().appendChangeLog({
      'action': action,
      'type': type,
      'name': model.getFullName(),
      'oldValue': model.normalizeExportData(oldData),
      'newValue': model.normalizeExportData(newData)
    });
  },

  // DRAW

  redraw: function () {
    if (this.isActive()) {
      this.app = this.studio.getActiveApp();
      this.draw();
    }
  },

  clear: function () {
    this.$tbody.empty();
  },

  draw: function () {
    this.dt.clear();
    this.dt.rows.add(this.app.changeLogs.reverse());
    this.dt.draw();
  },

  translateCell: function (data, type) {
    return data ? Helper.L10n.translate(data, 'changelog') : data;
  },

  formatValues: function (data) {
    var result = '';
    if (data) {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          result += '<div><span>'+ key +':</span> '+ Helper.stringifyJson(data[key]) +'</div>';
        }
      }
    }
    return result
  },
});