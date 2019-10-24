"use strict";

Studio.DeployModuleList = function ($container, studio) {
  Studio.BaseTable.call(this, 'deployModules', '.list-area', $container, studio);
};

$.extend(Studio.DeployModuleList.prototype, Studio.BaseTable.prototype, {
  constructor: Studio.DeployModuleList,

  initListeners: function () {
    Studio.BaseTable.prototype.initListeners.call(this);
    var redraw = this.redraw.bind(this);
    this.studio.events.on('createDeployModule', redraw);
    this.studio.events.on('updateDeployModule', redraw);
    this.studio.events.on('removeDeployModule', redraw);
  },

  getModelByRow: function ($row) {
    return this.studio.getActiveDeploy().getModule($row.data('id'));
  },

  getModels: function () {
    return this.studio.getActiveDeploy().modules;
  },

  getRowContent: function (model) {
    var data = model.data || {};
    var result = this.drawCell(data.name);
    result += this.drawCell(Helper.Format.json(data.globals));
    result += this.drawCell(Helper.Format.json(data.import));
    result += this.drawCell(Helper.Format.json(data.statics));
    return result;
  },

  onDoubleClickRow: function (event) {
    this.studio.toolbar.onUpdateDeployModule();
  },

  createDataTable: function () {
    this.dt = this.$table.DataTable({
      sDom: "<'row'<'col-sm-6'f><'col-sm-6'l>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
      columns: [{
        data: 'name',
        orderable: true,
        searchable: false,
        render: Helper.DataTable.formatJson,
      }, {
        data: 'globals',
        orderable: false,
        searchable: false,
        render: Helper.DataTable.formatJson
      },{
        data: 'import',
        orderable: false,
        searchable: false,
        render: Helper.DataTable.formatJson
      },{
        data: 'statics',
        orderable: false,
        searchable: false,
        render: Helper.DataTable.formatJson
      }],
      order: [[0, 'asc']]
    });
  },

});