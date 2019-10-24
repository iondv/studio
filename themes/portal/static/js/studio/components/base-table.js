"use strict";

Studio.BaseTable = function (mode, selector, $container, studio) {
  this.$container = $container;
  this.studio = studio;
  this.menu = studio.menu;
  this.mode = mode;
  this.$area = $container.children(selector);
  this.$table = this.$area.find('.table');
  this.$tbody = this.$table.children('tbody');
};

$.extend(Studio.BaseTable.prototype, {

  initListeners: function () {
    this.studio.events.on('changeContentMode', this.onChangeContentMode.bind(this));
    this.$tbody.on('click', 'tr', this.onClickRow.bind(this));
    this.$tbody.on('dblclick', 'tr', this.onDoubleClickRow.bind(this));
  },

  isActive: function () {
    return this.$container.is(':visible');
  },

  getActiveModel: function () {
    return this.getModelByRow(this.getActiveRow());
  },

  getActiveRow: function () {
    return this.$tbody.children('.active');
  },

  toggleActiveRow: function ($row, state) {
    this.getActiveRow().removeClass('active');
    $row.toggleClass('active', state);
  },

  getRow: function (id) {
    return this.$tbody.children('[data-id="'+ id +'"]');
  },

  // HANDLER

  onChangeContentMode: function (event, mode) {
    this.$container.toggle(mode === this.mode);
    this.redraw();
  },

  onClickRow: function (event) {
    var $row = $(event.currentTarget);
    this.toggleActiveRow($row, true);
  },

  onDoubleClickRow: function (event) {
    var $row = $(event.currentTarget);
  },

  // DRAW

  redraw: function () {
    if (this.isActive()) {
      this.app = this.studio.getActiveApp();
      this.draw();
    }
  },

  draw: function () {
    var lastActiveId = this.getActiveRow().data('id');
    this.$tbody.html(this.getContent());
    this.toggleActiveRow(this.getRow(lastActiveId), true);
  },

  getContent: function () {
    return this.getModels().map(this.drawRow, this);
  },

  drawRow: function (model) {
    return '<tr data-id="'+ model.id +'">'+ this.getRowContent(model) +'</tr>';
  },

  drawCell: function (text, value) {
    value = value === undefined ? text : value;
    return '<td data-value="'+ Helper.stringifyEmpty(value) +'">'+ Helper.stringifyEmpty(text) +'</td>';
  },

  clear: function () {
    this.$tbody.empty();
  }
});