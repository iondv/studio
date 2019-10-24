"use strict";

Studio.DeployGlobalJobList = function ($container, studio) {
  Studio.BaseTable.call(this, 'deployGlobalJob', '.list-area', $container, studio);
};

$.extend(Studio.DeployGlobalJobList.prototype, Studio.BaseTable.prototype, {
  constructor: Studio.DeployGlobalJobList,

  initListeners: function () {
    Studio.BaseTable.prototype.initListeners.call(this);
    var redraw = this.redraw.bind(this);
    this.studio.events.on('createDeployGlobalJob', redraw);
    this.studio.events.on('updateDeployGlobalJob', redraw);
    this.studio.events.on('removeDeployGlobalJob', redraw);
  },

  getModelByRow: function ($row) {
    return this.studio.getActiveDeployGlobal().getJob($row.data('id'));
  },

  getModels: function () {
    return this.studio.getActiveDeployGlobal().jobs;
  },

  getRowContent: function (model) {
    var data = model.data || {};
    var result = this.drawCell(data.code);
    result += this.drawCell(data.description);
    result += this.drawCell(Helper.Format.json(data.launch));
    result += this.drawCell(data.workerl);
    result += this.drawCell(Helper.Format.json(data.di));
    return result;
  },

  onDoubleClickRow: function (event) {
    this.studio.toolbar.onUpdateDeployGlobalJob();
  },
});