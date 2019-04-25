"use strict";

Studio.Droppable = function ($area, studio) {
  this.$area = $area;
  this.studio = studio;
  this.events = new Helper.Events('droppable');
  this.init();
};

$.extend(Studio.Droppable.prototype, {

  init: function () {
    this.$area.mousedown(this.onMouseDown.bind(this));
    this.$area.mousemove(this.onMouseMove.bind(this));
    $(document.body).mouseup(this.onMouseUp.bind(this));
  },

  getSourceItem: function (element) {
    var $item = $(element).closest('.droppable-touch').closest('.droppable-item');
    return $item.hasClass('selected') ? $item : null;
  },

  onMouseDown: function (event) {
    this.stop();
    if (event.buttons !== 1) {
      return true;
    }
    this.$source = this.getSourceItem(event.target);
    if (this.$source) {
      this._x = event.pageX;
      this._y = event.pageY;
    }
  },

  onMouseMove: function (event) {
    if (event.buttons !== 1) {
      return this.stop();
    }
    if (!this.$source) {
      return true;
    }
    var offset = {
      'left': event.pageX - this._x,
      'top': event.pageY - this._y
    };
    if (this.isDragOffset(offset)) {
      this._dragged ? this.drag(offset, event) : this.start(offset);
    }
  },

  onMouseUp: function (event) {
    if (this.$source && this._dragged) {
      this.events.trigger('drop', {
        '$item': this.$source,
        '$target': $(document.elementFromPoint(event.clientX, event.clientY))
      });
      this._dragged = null;
    }
    this.stop();
    return true;
  },

  isDragOffset: function (offset) {
    return offset.left < -2 || offset.left > 2 || offset.top < -2 || offset.top > 2;
  },

  start: function (offset) {
    if (this.$source) {
      this._dragged = true;
      this._areaOffset = this.$area.offset();
      this.$clone = this.cloneItem(this.$source);
      this.$area.append(this.$clone);
      this._pos = this.$clone.offset();
      this.$area.addClass('dragging');
    }
  },

  drag: function (offset, event) {
    offset.left += this._pos.left;
    offset.top += this._pos.top;
    if (offset.left < this._areaOffset.left) {
      offset.left = this._areaOffset.left;
    }
    if (offset.top < this._areaOffset.top) {
      offset.top = this._areaOffset.top;
    }
    this.$clone.offset(offset);
    this.events.trigger('drag', {
      '$item': this.$clone,
      '$target': $(document.elementFromPoint(event.clientX, event.clientY)),
      'position': this.getPosition(offset)
    });
  },

  cloneItem: function ($item) {
    var $clone = $item.clone().addClass('dragging');
    $clone.offset(this.getPosition($item.offset()));
    $clone.width($item.outerWidth());
    $item.addClass('dragged');
    return $clone;
  },

  stop: function () {
    if (this.$source) {
      if (this._dragged) {
        this.events.trigger('end', {
          '$item': this.$source
        });
      }
      this.$source.removeClass('dragged');
      this.$source = null;
    }
    if (this.$clone) {
      this.$clone.remove();
      this.$clone = null;
    }
    this._dragged = false;
    this.$area.removeClass('dragging');
  },

  getPosition: function (pos) {
    pos.left += this.$area.scrollLeft() - this._areaOffset.left;
    pos.top += this.$area.scrollTop() - this._areaOffset.top;
    return pos;
  }
});