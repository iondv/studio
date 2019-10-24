"use strict";

Studio.DeployGlobalTopMenuList = function ($container, studio) {
  Studio.BaseTable.call(this, 'deployGlobalTopMenu', '.list-area', $container, studio);
};

$.extend(Studio.DeployGlobalTopMenuList.prototype, Studio.BaseTable.prototype, {
  constructor: Studio.DeployGlobalTopMenuList,

  initListeners: function () {
    Studio.BaseTable.prototype.initListeners.call(this);
    var redraw = this.redraw.bind(this);
    this.studio.events.on('createDeployGlobalTopMenu', redraw);
    this.studio.events.on('updateDeployGlobalTopMenu', redraw);
    this.studio.events.on('removeDeployGlobalTopMenu', redraw);
  },

  getModelByRow: function ($row) {
    return this.studio.getActiveDeployGlobal().getTopMenuItem($row.data('id'));
  },

  getModels: function () {
    return this.studio.getActiveDeployGlobal().topMenu;
  },

  getRowContent: function (model) {
    var data = model.data || {};
    var result = this.drawCell(Helper.Format.boolean(data.system), data.system ? 1 : 0);
    result += this.drawCell(data.name);
    result += this.drawCell(data.id);
    result += this.drawCell(data.url);
    result += this.drawCell(data.caption);
    return result;
  },

  onDoubleClickRow: function (event) {
    this.studio.toolbar.onUpdateDeployGlobalTopMenu();
  },
});