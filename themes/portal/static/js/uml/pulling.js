"use strict";

Uml.Pulling = function ($area) {
  this.$area = $area;
  this.$container = $area.parent();
  this.$line = this.$container.children('.uml-pull-line');
  this.events = new Helper.Events('uml-pull');
  this.$area.mousedown(this.onMouseDown.bind(this));
  this.$area.mousemove(this.onMouseMove.bind(this));
  $(document.body).mouseup(this.onMouseUp.bind(this));
};

$.extend(Uml.Pulling.prototype, {

  stop: function () {
    if (this.$rect) {
      if (this._pulled) {
        this.events.trigger('end', {
          '$source': this.$rect,
          '$target': this.$target,
          'position': this.getPosition(this.$rect.offset())
        });
      }
      this.toggleTarget();
      this.$touch.removeClass('active');
      this.$rect.removeClass('uml-pulled');
      this.$line.hide();
      this.$rect = null;
    }
    this.$area.removeClass('uml-pulling');
  },

  onMouseDown: function (event) {
    this.stop();
    this.$touch = $(event.target).closest('.uml-pull-touch');
    if (!this.$touch.length) {
      return true;
    }
    event.stopImmediatePropagation();
    this.$touch.addClass('active');
    this.$rect = this.$touch.closest('.uml-rect').addClass('uml-pulled');
    this.$rectParent = this.$rect.parent();
    this._areaOffset = this.$area.offset();
    var pos = this.$touch.offset();
    pos.left += Math.round(this.$touch.width() / 2);
    pos.top += Math.round(this.$touch.height() / 2);
    this._x = pos.left;
    this._y = pos.top;
    this._pos = this.getPosition(pos);
    this._pulled = false;
    this.$area.addClass('uml-pulling');
  },

  onMouseMove: function (event) {
    if (event.buttons !== 1) {
      return this.stop();
    }
    if (!this.$rect) {
      return true;
    }
    var x = event.pageX;
    var y = event.pageY;
    if (!this.isPullOffset(x - this._x, y - this._y)) {
      this.$line.hide();
      this._pulled = false;
      return true;
    }
    this.toggleTarget(this.getTarget(event.target));
    this.setLine(x, y);
    this._pulled = true;

    /*

    offset.left += this._pos.left;
    offset.top += this._pos.top;
    if (offset.left < this._areaOffset.left) {
      offset.left = this._areaOffset.left;
    }
    if (offset.top < this._areaOffset.top) {
      offset.top = this._areaOffset.top;
    }

    /*
    this.$rect.offset(offset);
    this.events.trigger('pull', {
      '$item': this.$rect,
      'position': this.getPosition(offset)
    }); //*/
  },

  onMouseUp: function (event) {
    this.stop();
  },

  toggleTarget: function ($target) {
    if (this.$target) {
      this.$target.removeClass('uml-pull-target');
    }
    this.$target = $target;
    if (this.$target) {
      this.$target.addClass('uml-pull-target');
    }
  },

  isPullOffset: function (dx, dy) {
    return dx < -8 || dx > 8 || dy < -8 || dy > 8;
  },

  getPosition: function (pos) {
    pos.left += this.$rectParent.scrollLeft() - this._areaOffset.left;
    pos.top += this.$rectParent.scrollTop() - this._areaOffset.top;
    return pos;
  },

  getTarget: function (element) {
    var $target = $(element).closest('.uml-rect');
    if ($target.length && $target.get(0) !== this.$rect.get(0)) {
      return $target;
    }
  },

  setLine: function (x, y) {
    this.$line.show();
    var dx = x - this._x;
    var dy = y - this._y;
    var length = Math.round(Math.sqrt(dx * dx + dy * dy));
    var angle = Math.atan2(dy, dx);
    this.$line.css({
      'left': this._pos.left,
      'top': this._pos.top,
      'width': length + 'px',
      'transform': 'rotate('+ angle +'rad)'
    });
  }
});