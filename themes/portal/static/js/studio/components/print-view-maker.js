"use strict";

Studio.PrintViewMaker = function ($container, studio) {
  this.$container = $container;
  this.studio = studio;
  this.$itemTarget = this.$container.find('.studio-item-print-target');
  this.$listTarget = this.$container.find('.studio-list-print-target');

  this.$container.on('click', '.print-view-item', this.onClickPrintViewItem.bind(this));
  this.$container.on('dblclick', '.print-view-item', this.onDoubleClickPrintViewItem.bind(this));
};

$.extend(Studio.PrintViewMaker.prototype, {

  initListeners: function () {
    var redraw = this.redraw.bind(this);
    this.studio.events.on('changeContentMode', this.onChangeContentMode.bind(this));
    this.studio.events.on('changeActiveItem', redraw);
    this.studio.events.on('createClassPrintView', redraw);
    this.studio.events.on('updateClassPrintView', redraw);
    this.studio.events.on('removeClassPrintView', redraw);
  },

  isActive: function () {
    return this.$container.is(':visible');
  },

  getActivePrintViewId: function () {
    return this.getSelectedPrintViewItem().data('id');
  },

  getSelectedPrintViewItem: function () {
    return this.getPrintViewItems().filter('.selected');
  },

  getPrintViewItem: function (id) {
    return this.getPrintViewItems().filter('[data-id="'+ id +'"]');
  },

  getPrintViewItems: function () {
    return this.$container.find('.print-view-item');
  },

  clearSelectedPrintView: function () {
    this.getSelectedPrintViewItem().removeClass('selected');
  },

  selectPrintView: function (model) {
    //this.$container.find('.print-view-item.selected').removeClass('selected');
  },

  // HANDLERS

  onChangeContentMode: function (event, mode) {
    this.$container.toggle(mode === 'printView');
    this.redraw();
  },

  onClickPrintViewItem: function (event) {
    this.clearSelectedPrintView();
    $(event.currentTarget).toggleClass('selected');
  },

  onDoubleClickPrintViewItem: function (event) {
    this.studio.toolbar.onUpdateClassPrintView();
  },

  // DRAW

  redraw: function () {
    if (this.isActive()) {
      this.cls = this.studio.getActiveClass();
      this.draw();
    }
  },

  draw: function () {
    this.drawPrintViews(this.cls.getPrintViewsByType('item'), this.$itemTarget);
    this.drawPrintViews(this.cls.getPrintViewsByType('list'), this.$listTarget);
  },

  drawPrintViews: function (models, $target) {
    var content = models.map(this.renderPrintView, this).join('');
    $target.find('.studio-print-target-body').html(content);
  },

  renderPrintView: function (model) {
    return this.studio.renderSample('print-view-item', {
      'id': model.id,
      'title': model.getTitle()
    });
  }
});