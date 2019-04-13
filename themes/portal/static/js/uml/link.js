"use strict";

Uml.Link = function (data, page) {
  this.page = page;
  this.init(data);
};

$.extend(Uml.Link.prototype, {

  init: function (data) {
    this.data = data;
    this.id = data.id;
    this.target = data.target;
    this.source = data.source;
    this.$link = this.createHtml(data);
    this.page.$page.append(this.$link);
  },

  isSource: function (node) {
    return this.source === node;
  },

  isActive: function () {
    return this.$link.hasClass('active');
  },

  activate: function () {
    this.$link.addClass('active');
  },

  deactivate: function () {
    if (this.isActive()) {
      this.$link.removeClass('active');
    }
  },

  toggle: function (state) {
    this.$link.toggleClass('hidden', !state);
  },

  toggleClass: function (name, state) {
    this.$link.toggleClass(name, state);
  },

  getData: function (start, end) {
    var dx = end.left - start.left;
    var dy = end.top - start.top;
    var length = Math.round(Math.sqrt(dx * dx + dy * dy));
    var angle = Math.asin(dy / length);
    if (dx < 0) {
      angle = -angle;
    }
    this.$link.toggleClass('uml-link-flip', dx < 0);
    start.left += dx / 2;
    start.top += dy / 2;
    return [length - 12, start, angle];
  },

  setData: function (length, center, angle) {
    this.$link.css('transform', 'none');
    this.$link.width(length);
    center.left -= length / 2;
    this.setPosition(center);
    this.$link.css('transform', 'rotate('+ angle +'rad)');
  },

  getPosition: function () {
    return {
      'left': parseInt(this.$link.css('left')),
      'top': parseInt(this.$link.css('top'))
    }
  },

  setPosition: function (pos) {
    if (pos) {
      this.$link.css({
        'left': pos.left +'px',
        'top': pos.top + 'px'
      });
    }
  },

  update: function (data) {
    if (data) {
      this.remove();
      this.init(data);
    }
    this.updateData();
  },

  updateData: function () {
    this.setData.apply(this, this.getData.apply(this, this.page.getAnchors(this.source, this.target)));
  },

  remove: function () {
    this.$link.remove();
  },

  createHtml: function (data) {
    this.sample = data.sample || this.sample;
    return $(this.page.uml.getSample(this.sample, Object.assign({}, data))).data('uml', this);
  }
});

// PARENT LINK

Uml.ParentLink = function (data, page) {
  this.sample = 'parentLink';
  Uml.Link.call(this, data, page);
};

$.extend(Uml.ParentLink.prototype, Uml.Link.prototype, {
  constructor: Uml.ParentLink,

  isNode: function (node) {
    return this.target === node || this.source === node;
  }
});

// REF LINK

Uml.RefLink = function (data, page) {
  this.sample = 'refLink';
  Uml.Link.call(this, data, page);
};

$.extend(Uml.RefLink.prototype, Uml.Link.prototype, {
  constructor: Uml.RefLink,

  isNode: function (node) {
    return this.target === node || this.source === node || this.source.rect === node;
  },

  isSource: function (node) {
    return this.source === node || this.source.rect === node;
  }
});

// COLLECTION LINK

Uml.CollectionLink = function (data, page) {
  this.sample = 'collectionLink';
  Uml.RefLink.call(this, data, page);
};

$.extend(Uml.CollectionLink.prototype, Uml.RefLink.prototype, {
  constructor: Uml.CollectionLink,
});