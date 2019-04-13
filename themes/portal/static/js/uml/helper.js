"use strict";

Uml.Helper = {

  getCoords: function (pos, width, height) {
    pos.width = width;
    pos.height = height;
    pos.cx = pos.left + parseInt(width / 2);
    pos.cy = pos.top + parseInt(height / 2);
    pos.right = pos.left + width;
    pos.bottom = pos.top + height;
    return pos;
  },

  getClosestPoints: function (a, b) {
    a = a.getCoords();
    b = b.getCoords();
    if (Uml.Helper.isOverlap(a, b)) {
      return [a, b];
    }
    return [a, b];
  },

  isOverlap: function (a, b) {
    return b.top < a.bottom && b.bottom > a.top && b.left < a.right && b.right > a.left;
  },
};