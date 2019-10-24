"use strict";

Studio.DeployGlobalPluginList = function ($container, studio) {
  Studio.BaseTable.call(this, 'deployGlobalPlugin', '.list-area', $container, studio);
};

$.extend(Studio.DeployGlobalPluginList.prototype, Studio.BaseTable.prototype, {
  constructor: Studio.DeployGlobalPluginList,

  initListeners: function () {
    Studio.BaseTable.prototype.initListeners.call(this);
    var redraw = this.redraw.bind(this);
    this.studio.events.on('createDeployGlobalPlugin', redraw);
    this.studio.events.on('updateDeployGlobalPlugin', redraw);
    this.studio.events.on('removeDeployGlobalPlugin', redraw);
  },

  getModelByRow: function ($row) {
    return this.studio.getActiveDeployGlobal().getPlugin($row.data('id'));
  },

  getModels: function () {
    return this.studio.getActiveDeployGlobal().plugins;
  },

  getRowContent: function (model) {
    var data = model.data || {};
    var result = this.drawCell(data.code);
    result += this.drawCell(data.module);
    result += this.drawCell(data.initMethod);
    result += this.drawCell(data.initLevel);
    result += this.drawCell(Helper.Format.json(data.options));
    return result;
  },

  onDoubleClickRow: function (event) {
    this.studio.toolbar.onUpdateDeployGlobalPlugin();
  },
});