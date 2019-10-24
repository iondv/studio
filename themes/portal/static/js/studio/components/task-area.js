"use strict";

Studio.TaskArea = function ($container, studio) {
  Studio.BaseTable.call(this, 'task', '.task-area', $container, studio);
};

$.extend(Studio.TaskArea.prototype, Studio.BaseTable.prototype, {
  constructor: Studio.TaskArea,

  initListeners: function () {
    Studio.BaseTable.prototype.initListeners.call(this);
    var redraw = this.redraw.bind(this);
    this.studio.events.on('createTask', redraw);
    this.studio.events.on('updateTask', redraw);
    this.studio.events.on('removeTask', redraw);
  },

  getTaskByRow: function ($row) {
    return this.app.getTask($row.data('id'));
  },

  getContent: function () {
    var $intervalSelect = this.studio.taskForm.getAttr('interval').$value;
    this.intervalMap = Helper.Html.getSelectOptionMap($intervalSelect);
    return this.app.tasks.map(this.drawRow, this);
  },

  getRowContent: function (model) {
    var data = model.data;
    var result = this.drawCell(data.code);
    result += this.drawCell(data.title);
    result += this.drawCell(Helper.Format.boolean(data.active), data.active ? 1 : 0);
    result += this.drawCell(this.intervalMap[data.interval] || data.interval);
    result += this.drawCell(Helper.Format.timestamp(data.startDate), data.startDate);
    result += this.drawCell(Helper.Format.timestamp(data.endDate), data.endDate);
    return result;
  },

  onClickRow: function (event) {
    var $row = $(event.currentTarget);
    this.toggleActiveRow($row, true);
    this.menu.activate(this.menu.getItem($row.data('id')));
  },

  onDoubleClickRow: function (event) {
    var $row = $(event.currentTarget);
    this.menu.updateByItem(this.menu.getItem($row.data('id')));
  }
});