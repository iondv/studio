"use strict";

Uml.Rect = function (data, page) {
  this.data = data;
  this.id = data.id;
  this.page = page;
  this.uml = page.uml;
  this.sample = data.sample || 'rect';
  this.$rect = this.createHtml();
  this.$head = this.$rect.children('.uml-rect-head');
  this.page.$page.append(this.$rect);
  this.setPosition(data.offset);
  this.$attrs = this.$rect.children('.uml-rect-body');
  this.clearAttrs();
  this.createAttrs(data.attrs);
};

$.extend(Uml.Rect.prototype, {

  createHtml: function () {
    return $(this.uml.getSample(this.sample, Object.assign({
      'id': this.id,
    }, this.data))).data('uml', this);
  },

  toggleClass: function (name, state) {
    this.$rect.toggleClass(name, state);
  },

  clearAttrs: function () {
    this.attrs = [];
    this.$attrs.empty();
  },

  getAttr: function (id) {
    return id instanceof Uml.RectAttr ? id : this.attrs[Helper.Array.searchByNestedValue(id, 'id', this.attrs)];
  },

  createAttrs: function (items) {
    if (items instanceof Array) {
      items.forEach(function (data) {
        this.createAttr(data);
      }.bind(this));
    }
  },

  createAttr: function (data) {
    var attr = new Uml.RectAttr(data, this);
    this.attrs.push(attr);
    return attr;
  },

  removeAttr: function (attr) {
    Helper.Array.removeValue(attr, this.attrs);
  },

  update: function (data) {
    this.data = data;
    Helper.updateTemplate('update-rect-id', this.$rect, data);
  },

  remove: function () {
    this.$rect.remove();
    this.uml.events.trigger('removeRect', this);
  },

  isActive: function () {
    return this.$rect.hasClass('active');
  },

  activate: function () {
    this.$rect.addClass('active');
  },

  deactivate: function () {
    if (this.isActive()) {
      this.$rect.removeClass('active');
      Helper.Array.eachMethod('deactivate', this.attrs);
    }
  },

  deactivateAttrs: function () {
    Helper.Array.eachMethod('deactivate', this.attrs);
  },

  getPosition: function () {
    return {
      'left': parseInt(this.$rect.css('left')),
      'top': parseInt(this.$rect.css('top'))
    };
  },

  setPosition: function (pos) {
    if (pos) {
      this.$rect.css({
        'left': pos.left +'px',
        'top': pos.top + 'px'
      });
    }
  },

  resolveSize: function () {
    this.width = this.$rect.width();
    this.height = this.$rect.height();
  },

  getAnchor: function () {
    return this.getCenter();
  },

  getCenter: function () {
    let pos = this.getPosition();
    pos.left += parseInt(this.$rect.width() / 2);
    pos.top += parseInt(this.$rect.height() / 2);
    return pos;
  },

  getSize: function () {
    return {
      'width': this.$rect.width(),
      'height': this.$rect.height()
    };
  },

  getSourceAnchorPoints: function () {
    var pos = this.getCenter();
    return [[pos.left, pos.top]];
  },

  getTargetAnchorPoints: function () {
    var pos = this.getPosition();
    var size = this.getSize();
    var cx = pos.left + parseInt(size.width / 2);
    var cy = pos.top + parseInt(size.height / 2);
    return [
      [cx, pos.top],
      [pos.left, cy],
      [pos.left + size.width, cy],
      [cx, pos.top + size.height],
      [pos.left, pos.top],
      [pos.left + size.width, pos.top],
      [pos.left, pos.top + size.height],
      [pos.left + size.width, pos.top + size.height]
    ];
  }
});