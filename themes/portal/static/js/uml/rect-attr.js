"use strict";

Uml.RectAttr = function (data, rect) {
  this.id = data.id;
  this.data = data;
  this.rect = rect;
  this.uml = rect.uml;
  this.$attr = this.createHtml();
  this.rect.$attrs.append(this.$attr);
};

$.extend(Uml.RectAttr.prototype, {

  createHtml: function () {
    return $(this.uml.getSample('attr', Object.assign({
      'id': this.id
    }, this.data))).data('uml', this);
  },

  getCoords: function () {
    return Uml.Helper.getCoords(this.getPosition(), this.$attr.width(), this.$attr.height());
  },

  update: function (data) {
    this.data = data;
    Helper.updateTemplate('update-attr-id', this.$attr, data);
  },

  remove: function () {
    this.$attr.remove();
    this.uml.events.trigger('removeRectAttr', this);
  },

  isActive: function () {
    return this.$attr.hasClass('active');
  },

  activate: function () {
    this.$attr.addClass('active');
  },

  deactivate: function () {
    this.$attr.removeClass('active');
  },

  getAnchor: function () {
    return this.getCenter();
  },

  getCenter: function () {
    let pos = this.getPosition();
    pos.left += parseInt(this.$attr.width() / 2);
    pos.top += parseInt(this.$attr.height() / 2);
    return pos;
  },

  getPosition: function () {
    var pos = this.$attr.position();
    var rectPos = this.rect.getPosition();
    return {
      'left': rectPos.left + pos.left,
      'top': rectPos.top + pos.top
    };
  },

  getSize: function () {
    return {
      'width': this.$attr.width(),
      'height': this.$attr.height()
    };
  },

  getSourceAnchorPoints: function () {
    var pos = this.getCenter();
    return [[pos.left, pos.top]];
  },

  getTargetAnchorPoints: function () {
    var pos = this.getCenter();
    return [[pos.left, pos.top]];
  }
});