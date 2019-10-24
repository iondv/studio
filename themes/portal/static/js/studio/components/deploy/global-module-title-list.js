"use strict";

Studio.DeployGlobalModuleTitleList = function ($container, studio) {
  Studio.BaseTable.call(this, 'deployGlobalModuleTitle', '.list-area', $container, studio);
};

$.extend(Studio.DeployGlobalModuleTitleList.prototype, Studio.BaseTable.prototype, {
  constructor: Studio.DeployGlobalModuleTitleList,

  initListeners: function () {
    Studio.BaseTable.prototype.initListeners.call(this);
    var redraw = this.redraw.bind(this);
    this.studio.events.on('createDeployGlobalModuleTitle', redraw);
    this.studio.events.on('updateDeployGlobalModuleTitle', redraw);
    this.studio.events.on('removeDeployGlobalModuleTitle', redraw);
  },

  getModelByRow: function ($row) {
    return this.studio.getActiveDeployGlobal().getModuleTitle($row.data('id'));
  },

  getModels: function () {
    return Studio.DeployGlobalModuleTitleModel.sort(this.studio.getActiveDeployGlobal().moduleTitles);
  },

  getRowContent: function (model) {
    var data = model.data || {};
    var result = this.drawCell(data.type);
    result += this.drawCell(data.description);
    result += this.drawCell(data.order);
    result += this.drawCell(Helper.Format.boolean(data.skipModules), data.skipModules ? 1 : 0);
    return result;
  },

  onDoubleClickRow: function (event) {
    this.studio.toolbar.onUpdateDeployGlobalModuleTitle();
  },
});