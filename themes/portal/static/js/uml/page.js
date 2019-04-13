"use strict";

Uml.Page = function (data, uml) {
  this.data = data;
  this.id = data.id;
  this.uml = uml;
  this.$page = this.createHtml();
  this.uml.$pages.append(this.$page);
  this.clearRects();
  this.createRects(data.rects);
  this.clearLinks();
  this.addLinks(data.links);
};

$.extend(Uml.Page.prototype, {

  createHtml: function () {
    return $(this.uml.getSample('page', {'id': this.id})).data('uml', this);
  },

  isActive: function () {
    return this.$page.hasClass('active');
  },

  getActiveItem: function () {
    return this.$page.children('.active').data('uml');
  },

  getItem: function (id) {
    return this.rectMap[id] || this.linkMap[id];
  },

  deactivateItems: function () {
    this.deactivateRects();
    this.deactivateLinks();
  },

  resolveOffset: function (pos) {
    var offset = this.$page.offset();
    pos.left = pos.left - this.$page.scrollLeft() + offset.left;
    pos.top = pos.top - this.$page.scrollTop() + offset.top;
    return pos;
  },

  addScroll: function (pos) {
    pos.left += this.$page.scrollLeft();
    pos.top += this.$page.scrollTop();
    return pos;
  },

  toggleUpdating: function (state) {
    this.$page.toggleClass('updating');
  },

  activate: function () {
    if (!this.isActive()) {
      this.uml.deactivatePages();
      this.$page.addClass('active');
      this.toggleUpdating(true);
      //Helper.Array.eachMethod('setPosition', this.rects);
      setTimeout(function () {
        this.updateLinks();
        this.toggleUpdating(false);
      }.bind(this), 0);
    }
  },

  deactivate: function () {
    this.$page.removeClass('active');
    Helper.Array.eachMethod('deactivate', this.rects);
  },

  remove: function () {
    this.$page.remove();
    this.uml.removePage(this);
  },

  // RECT

  getRect: function (id) {
    return id instanceof Uml.Rect ? id : this.rectMap[id];
  },

  createRects: function (items) {
    if (items instanceof Array) {
      items.forEach(this.createRect.bind(this));
    }
  },

  createRect: function (data) {
    var rect = new Uml.Rect(data, this);
    this.rects.push(rect);
    this.rectMap[rect.id] = rect;
    return rect;
  },

  clearRects: function () {
    this.rects = [];
    this.rectMap = {};
    this.$page.find('.uml-rect').remove();
  },

  deactivateRects: function () {
    Helper.Array.eachMethod('deactivate', this.rects);
  },

  removeRect: function (rect) {
    Helper.Array.removeValue(rect, this.rects);
    delete this.rectMap[rect.id];
    this.removeLinksByNode(rect);
  },

  removeRectAttr: function (attr) {
    attr.rect.removeAttr(attr);
    this.removeLinksByNode(attr);
  },

  // LINK

  getLink: function (id) {
    return this.linkMap[id];
  },

  deactivateLinks: function () {
    Helper.Array.eachMethod('deactivate', this.links);
  },

  clearLinks: function () {
    this.links = [];
    this.linkMap = {};
    this.$page.find('.uml-link').remove();
  },

  addLinks: function (items) {
    items.forEach(this.addLink, this);
  },

  addLink: function (data) {
    var link = this.createLink(data);
    if (link.id) {
      this.linkMap[link.id] = link;
    }
    this.links.push(link);
    return link;
  },

  resolveLinkData: function (data) {
    switch (data.type) {
      case 'parent':
        data.source = this.getRect(data.source);
        data.target = this.getRect(data.target);
        break;
      case 'ref':
      case 'collection':
        var rect = this.getRect(data.class);
        data.source = rect.getAttr(data.source);
        data.target = this.getRect(data.target);
        break;
    }
    return data;
  },

  createLink: function (data) {
    var rect = this.getRect(data.class);
    this.resolveLinkData(data);
    switch (data.type) {
      case 'parent': return new Uml.ParentLink(data, this);
      case 'ref': return new Uml.RefLink(data, this);
      case 'collection': return new Uml.CollectionLink(data, this);
    }
    throw new Error('Not found link type');
  },

  updateLinks: function () {
    Helper.Array.eachMethod('update', this.links);
  },

  updateLinksByNode: function (rect) {
    this.handleLinksByNode(rect, function (link) {
      link.update();
    });
  },

  toggleLinksByNode: function (rect, state) {
    this.handleLinksByNode(rect, function (link) {
      link.toggle(state);
    });
  },

  removeLinksByNode: function (rect, checker) {
    checker = checker || 'isNode';
    for (let i = this.links.length - 1; i >= 0; --i) {
      if (this.links[i][checker](rect)) {
        this.linkMap[this.links[i].id] = null;
        this.links[i].remove();
        this.links.splice(i, 1);

      }
    }
  },

  handleLinksByNode: function (rect, handler) {
    for (let i = 0; i < this.links.length; ++i) {
      if (this.links[i].isNode(rect)) {
        handler(this.links[i]);
      }
    }
  },

  // ANCHOR POINTS

  getAnchors: function (source, target) {
    var centerSource = source.getCenter();
    var x1 = centerSource.left;
    var y1 = centerSource.top;
    var pos = target.getPosition();
    var size = target.getSize();
    var x2 = pos.left + size.width / 2;
    var y2 = pos.top + size.height / 2;
    var bottom = pos.top + size.height;
    var right = pos.left + size.width;
    var lines = [
      [pos.left, pos.top, right, pos.top],
      [pos.left, bottom, right, bottom],
      [pos.left, pos.top, pos.left, bottom],
      [right, pos.top, right, bottom]
    ];
    var s1x = x2 - x1;
    var s1y = y2 - y1;
    for (var i = 0; i < lines.length; ++i) {
      var x3 = lines[i][0];
      var y3 = lines[i][1];
      var x4 = lines[i][2];
      var y4 = lines[i][3];
      var s2x = x4 - x3;
      var s2y = y4 - y3;
      var s = (-s1y * (x1 - x3) + s1x * (y1 - y3)) / (-s2x * s1y + s1x * s2y);
      var t = ( s2x * (y1 - y3) - s2y * (x1 - x3)) / (-s2x * s1y + s1x * s2y);
      if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        return [centerSource, {
          'left': Math.round(x1 + (t * s1x)),
          'top': Math.round(y1 + (t * s1y))
        }];
      }
    }
    return [centerSource, {'left': x2, 'top': y2}];
  },


  getSimpleAnchors: function (a, b) {
    var pA = a.getSourceAnchorPoints();
    var pB = b.getTargetAnchorPoints();
    var source, target, minDist = 999999;
    for (var i = 0; i < pA.length; ++i) {
      for (var j = 0; j < pB.length; ++j) {
        var dw = pA[i][0] - pB[j][0];
        var dh = pA[i][1] - pB[j][1];
        var dist = dw * dw + dh * dh;
        if (dist < minDist) {
          minDist = dist;
          source = pA[i];
          target = pB[j];
        }
      }
    }
    return [{
      'left': source[0],
      'top': source[1]
    }, {
      'left': target[0],
      'top': target[1]
    }];
  }
});