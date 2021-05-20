"use strict";

Studio.Tabs = function ($container, studio) {
  this.studio = studio;
  this.$container = $container;
  this.$list = $container.find('.tab-list');
  this.$add = $container.find('.tab-add');
  this.$import = $container.find('.tab-import');
  this.$xls = $container.find('.tab-xls');
  this.$xlsFile = this.$xls.find('#xlsFile');
  this.init();
};

$.extend(Studio.Tabs.prototype, {

  init: function () {
    this.$list.on('click', '.tab-close', this.onRemoveTab.bind(this));
    this.$list.on('click', '.tab', this.onSelectTab.bind(this));
    this.$list.on('dblclick', '.active.tab', this.onUpdateTab.bind(this));
    this.$add.click(this.onAdd.bind(this));
    this.$import.click(this.onImport.bind(this));
    this.$xls.on('input', this.onXls.bind(this));
  },

  initListeners: function () {
    this.studio.events.on('createApp', this.onCreateApp.bind(this));
    this.studio.events.on('loadApp', this.onLoadApp.bind(this));
    this.studio.events.on('updateApp', this.onUpdateApp.bind(this));
    this.studio.events.on('removeApp', this.onRemoveApp.bind(this));
    this.studio.events.on('changeActiveItem', this.onChangeActiveItem.bind(this));
  },

  onCreateApp: function (event, model) {
    this.activate(this.createTab(model));
    if (model.isServerSync() && !this.studio.appForm.exists) {
      setTimeout(function () {
        this.studio.toolbar.onUpdateApp();
      }.bind(this), 0);
    }
  },

  onLoadApp: function (event, model) {
    this.onUpdateApp(event, model);
  },

  onUpdateApp: function (event, model) {
    let $tab = this.getTab(model.id);
    let active = this.isActive($tab);
    $tab.replaceWith(this.renderTab(model));
    this.getTab(model.id).toggleClass('active', active);
  },

  onRemoveApp: function (event, model) {
    this.getTab(model.getId()).remove();
    setTimeout(function () {
      this.getTabs().first().click();
    }.bind(this), 0);
  },

  onChangeActiveItem: function (event) {
    var app = this.studio.getActiveApp();
    if (!app) {
      return this.deactivateAll();
    }
    this.activate(this.getTab(app.id));
  },

  onSelectTab: function(event) {
    var $tab = this.getClosestTab(event.currentTarget);
    if (!this.isActive($tab)) {
      this.studio.menu.activateById($tab.data('id'));
    }
  },

  onUpdateTab: function(event) {
    var $tab = this.getClosestTab(event.currentTarget);
    this.studio.appForm.update(this.studio.getActiveApp());
  },

  onRemoveTab: function (event) {
    var $tab = this.getClosestTab(event.currentTarget);
    if (confirm(Helper.L10n.translate('Remove application?'))) {
      this.studio.getApp($tab.data('id')).remove();
    }
  },

  onAdd: function () {
    this.studio.appForm.create();
  },

  onImport: function () {
    this.studio.importExternalAppForm.show();
  },

  onXls: async function () {
    const xlsFile = await this.$xlsFile[0].files[0].arrayBuffer();
    this.$xlsFile[0].value = '';
    const app = await fetch('/api/xls', {
      method: 'PUT',
      body: xlsFile
    }).then(response => response.arrayBuffer());
    this.studio.toggleLoader(false);
    (new Studio.AppImport(app, this.studio)).execute();
  },

  restore: function () {
    this.studio.apps.forEach(this.createTab, this);
  },

  createTab: function (app) {
    this.$list.append(this.renderTab(app));
    return this.getTabs().last();
  },

  renderTab: function (app) {
    return this.studio.renderSample('appTab', {
      'id': app.getId(),
      'title': app.getName(),
      'description': app.getDescription()
    });
  },

  isActive: function ($tab) {
    return $tab.hasClass('active');
  },

  activate: function ($tab) {
    if ($tab.length && !this.isActive($tab)) {
      this.deactivateAll();
      $tab.addClass('active');
    }
  },

  deactivateAll: function () {
    this.getTabs().removeClass('active');
  },

  getTab: function (id) {
    return this.getTabs().filter('[data-id="'+ id +'"]');
  },

  getClosestTab: function (element) {
    return $(element).closest('.tab');
  },

  getTabs: function () {
    return this.$list.children();
  }
});