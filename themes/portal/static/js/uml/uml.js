"use strict";

window.Uml = function ($container) {
  this.events = new Helper.Events('uml:');
  this.$container = $container;
  this.$pages = $container.find('.uml-pages');
  this.$samples = $container.find('.uml-samples');
  this.pulling = new Uml.Pulling(this.$pages);
  this.draggable = new Uml.Draggable(this.$pages);
  this.init();
};

$.extend(Uml.prototype, {

  init: function () {
    this.initListeners();
    this.clearAll();
  },

  initListeners: function () {
    this.events.on('removeRect', this.onRemoveRect.bind(this));
    this.events.on('removeRectAttr', this.onRemoveRectAttr.bind(this));
    this.$container.on('click', '.uml-link-select', this.onClickLink.bind(this));
    this.$container.on('mousedown', '.uml-rect-attr', this.onClickRectAttr.bind(this));
    this.$container.on('mousedown', '.uml-rect', this.onClickRect.bind(this));
    this.$container.on('mousedown', '.uml-page', this.onClickPage.bind(this));
    this.$container.on('dblclick', '.uml-link-select', this.onDoubleClickLink.bind(this));
    this.$container.on('dblclick', '.uml-rect-attr', this.onDoubleClickRectAttr.bind(this));
    this.$container.on('dblclick', '.uml-rect', this.onDoubleClickRect.bind(this));
    this.$container.on('dblclick', '.uml-page', this.onDoubleClickPage.bind(this));
    this.draggable.events.on('start', this.onStartDrag.bind(this));
    this.draggable.events.on('end', this.onEndDrag.bind(this));
  },

  onClickLink: function (event) {
    event.stopImmediatePropagation();
    event.umlTarget = this.getLinkByItem(event.target);
    this.events.trigger('clickLink', event);
  },

  onDoubleClickLink: function (event) {
    event.stopImmediatePropagation();
    event.umlTarget = this.getLinkByItem(event.target);
    this.events.trigger('doubleClickLink', event);
  },

  onClickRect: function (event) {
    event.stopImmediatePropagation();
    event.umlTarget = this.getRectByItem(event.target);
    this.events.trigger('clickRect', event);
    setTimeout(function () {
      this.draggable.onMouseDown(event);
    }.bind(this), 0);
  },

  onClickRectAttr: function (event) {
    event.stopImmediatePropagation();
    event.umlTarget = this.getRectAttrByItem(event.target);
    this.events.trigger('clickRectAttr', event);
  },

  onClickPage: function (ecent) {
    event.stopImmediatePropagation();
    event.umlTarget = this.getPageByItem(event.target);
    this.events.trigger('clickPage', event);
  },

    onDoubleClickRect: function (event) {
    event.stopImmediatePropagation();
    event.umlTarget = this.getRectByItem(event.target);
    this.events.trigger('doubleClickRect', event);
  },

  onDoubleClickRectAttr: function (event) {
    event.stopImmediatePropagation();
    event.umlTarget = this.getRectAttrByItem(event.target);
    this.events.trigger('doubleClickRectAttr', event);
  },

  onDoubleClickPage: function (ecent) {
    event.stopImmediatePropagation();
    event.umlTarget = this.getPageByItem(event.target);
    this.events.trigger('doubleClickPage', event);
  },

  onStartDrag: function (event, data) {
    var rect = this.getRectByItem(data.$item);
    if (rect) {
      rect.page.toggleLinksByNode(rect, false);
    }
  },

  onEndDrag: function (event, data) {
    var rect = this.getRectByItem(data.$item);
    if (rect) {
      rect.page.toggleLinksByNode(rect, true);
      rect.page.updateLinksByNode(rect);
    }
  },

  onRemoveRect: function (event, rect) {
    rect.page.removeRect(rect);
  },

  onRemoveRectAttr: function (event, attr) {
    attr.rect.page.removeRectAttr(attr);
  },

  getSample: function (id, params) {
    var content = this.$samples.children('[data-id="'+ id +'"]').html();
    return Helper.resolveTemplate(content, params);
  },

  clearAll: function () {
    this.pages = [];
    this.$pages.empty();
  },

  getLinkByItem: function (item) {
    return $(item).closest('.uml-link').data('uml');
  },

  getRectAttr: function (id, rectId, pageId) {
    var rect = this.getRect(rectId, pageId);
    return rect && rect.getAttr(id);
  },

  getRectAttrByItem: function (item) {
    return $(item).closest('.uml-rect-attr').data('uml');
  },

  getRect: function (id, pageId) {
    var page = this.getPage(pageId);
    return page && page.getRect(id);
  },

  getRectByItem: function (item) {
    return $(item).closest('.uml-rect').data('uml');
  },

  getPage: function (id) {
    return this.pages[Helper.Array.searchByNestedValue(id, 'id', this.pages)];
  },

  getPageByItem: function (item) {
    return $(item).closest('.uml-page').data('uml');
  },

  getActivePage: function () {
    return this.$pages.children('.active').data('uml');
  },

  deactivatePages: function () {
    var page = this.getActivePage();
    if (page) {
      page.deactivate();
    }
  },

  createPage: function (data) {
    var page = new Uml.Page(data, this);
    this.pages.push(page);
    return page;
  },

  removePage: function (page) {
    Helper.Array.removeValue(page, this.pages);
  }
});