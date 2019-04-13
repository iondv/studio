"use strict";

Studio.TaskArea = function ($container, studio) {
  this.$container = $container;
  this.studio = studio;
  this.menu = studio.menu;
  this.$area = $container.children('.task-area');
  this.$table = this.$area.find('.table');
  this.$tbody = this.$table.children('tbody');
};

$.extend(Studio.TaskArea.prototype, {

  initListeners: function () {
    var redraw = this.redraw.bind(this);
    this.studio.events.on('changeContentMode', this.onChangeContentMode.bind(this));
    this.studio.events.on('createTask', redraw);
    this.studio.events.on('updateTask', redraw);
    this.studio.events.on('removeTask', redraw);

    this.$tbody.on('click', 'tr', this.onClickRow.bind(this));
    this.$tbody.on('dblclick', 'tr', this.onDoubleClickRow.bind(this));
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
    this.$container.toggle(mode === 'task');
    this.redraw();
  },

  onClickRow: function (event) {
    var $row = $(event.currentTarget);
    this.toggleActiveRow($row, true);
    this.menu.activate(this.menu.getItem($row.data('id')));
  },

  onDoubleClickRow: function (event) {
    var $row = $(event.currentTarget);
    this.menu.updateByItem(this.menu.getItem($row.data('id')));
  },

  // DRAW

  redraw: function () {
    if (this.isActive()) {
      this.app = this.studio.getActiveApp();
      this.draw();
    }
  },

  draw: function () {
    var $intervalSelect = this.studio.taskForm.getAttr('interval').$value;
    this.intervalMap = Helper.Html.getSelectOptionMap($intervalSelect);
    var lastActiveId = this.getActiveRow().data('id');
    var content = this.app.tasks.map(this.drawRow, this);
    this.$tbody.html(content);
    this.toggleActiveRow(this.getRow(lastActiveId), true);
  },

  drawRow: function (task) {
    var data = task.data;
    var result = this.drawCell(data.code);
    result += this.drawCell(data.title);
    result += this.drawCell(Helper.Format.boolean(data.active), data.active ? 1 : 0);
    result += this.drawCell(this.intervalMap[data.interval] || data.interval);
    result += this.drawCell(Helper.Format.timestamp(data.startDate), data.startDate);
    result += this.drawCell(Helper.Format.timestamp(data.endDate), data.endDate);
    return '<tr data-id="'+ task.id +'">'+ result +'</tr>';
  },

  drawCell: function (text, value) {
    return '<td data-value="'+ Helper.stringifyEmpty(value) +'">'+ Helper.stringifyEmpty(text) +'</td>';
  },

  clear: function () {
    this.$tbody.empty();
  }
});