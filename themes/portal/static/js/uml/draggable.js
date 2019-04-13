"use strict";

Uml.Draggable = function ($area) {
  this.$area = $area;
  this.events = new Helper.Events('uml-draggable');
  this.$area.mousedown(this.onMouseDown.bind(this));
  this.$area.mousemove(this.onMouseMove.bind(this));
  $(document.body).mouseup(this.onMouseUp.bind(this));
};

$.extend(Uml.Draggable.prototype, {

  stop: function () {
    if (this.$drag) {
      this.$drag.removeClass('uml-dragged');
      if (this._dragged) {
        this.events.trigger('end', {
          '$item': this.$drag,
          'position': this.getPosition(this.$drag.offset())
        });
      }
      this.$drag = null;
    }
    this.$area.removeClass('uml-dragging');
  },

  onMouseDown: function (event) {
    this.stop();
    var $item = $(event.target).closest('.uml-draggable-touch').closest('.uml-draggable');
    if ($item.hasClass('active')) {
      this.$drag = $item.addClass('uml-dragged');
      this.$dragParent = this.$drag.parent();
      this._areaOffset = this.$area.offset();
      this._pos = this.$drag.offset();
      this._x = event.pageX;
      this._y = event.pageY;
      this._dragged = false;
      this.$area.addClass('uml-dragging');
    }
  },

  onMouseMove: function (event) {
    if (event.buttons !== 1) {
      return this.stop();
    }
    if (!this.$drag) {
      return true;
    }
    var offset = {
      'left': event.pageX - this._x,
      'top': event.pageY - this._y
    };
    if (!this.isDragOffset(offset)) {
      return true;
    }
    offset.left += this._pos.left;
    offset.top += this._pos.top;
    if (offset.left < this._areaOffset.left) {
      offset.left = this._areaOffset.left;
    }
    if (offset.top < this._areaOffset.top) {
      offset.top = this._areaOffset.top;
    }
    var startDragging = !this._dragged;
    this._dragged = true;
    this.$drag.offset(offset);
    this.events.trigger(startDragging ? 'start' : 'drag', {
      '$item': this.$drag,
      'position': this.getPosition(offset)
    });
  },

  onMouseUp: function (event) {
    this.stop();
  },

  isDragOffset: function (offset) {
    return offset.left < -2 || offset.left > 2 || offset.top < -2 || offset.top > 2;
  },

  getPosition: function (pos) {
    pos.left += this.$dragParent.scrollLeft() - this._areaOffset.left;
    pos.top += this.$dragParent.scrollTop() - this._areaOffset.top;
    return pos;
  }
});