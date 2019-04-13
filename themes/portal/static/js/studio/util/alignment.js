"use strict";

Studio.Alignment = function (data) {
  this.xPadding = 20;
  this.page = data.page;
  this.items = data.items;
};

$.extend(Studio.Alignment.prototype, {

  execute: function () {
    this.setMaxValues();
    this.items.sort(this.compareItemsByHeight);
    this.columns = this.createColumns();

    for (var i = 0; i < this.items.length; ++i) {
      var item = this.items[i];
      var column = this.getTargetColumn(item);
      column.appendItem(item);
    }
    this.alignItems();
    return this.items;
  },

  alignItems: function () {
    var left = 0;
    for (var i = 0; i < this.columns.length; ++i) {
      var column = this.columns[i];
      column.offsetItems(left);
      left += column.width;
    }
  },

  getTargetColumn: function (item) {
    return this.getMinHeightColumn();
  },

  getMinHeightColumn: function () {
    var minColumn = this.columns[0];
    var minHeight = minColumn.height;
    for (var i = 1; i < this.columns.length; ++i) {
      if (this.columns[i].height < minHeight) {
        minColumn = this.columns[i];
        minHeight = minColumn.height;
      }
    }
    return minColumn;
  },

  createColumns: function () {
    var columns = [];
    var width = this.maxItemWidth + this.xPadding * 2;
    var numColumns = Math.floor(this.page.width / width);
    for (var i = 0; i < numColumns; ++i) {
      columns.push(new Studio.Alignment.Column(width));
    }
    return columns;
  },

  compareItemsByHeight: function (a, b) {
    return b.height - a.height;
  },

  setMaxValues: function () {
    this.maxItemWidth = 1;
    this.maxItemHeight = 1;
    for (var i = 0; i < this.items.length; ++i) {
      var item = this.items[i];
      if (item.width > this.maxItemWidth) {
        this.maxItemWidth = item.width;
      }
      if (item.height > this.maxItemHeight) {
        this.maxItemHeight = item.height;
      }
    }
  }
});


Studio.Alignment.Column = function (maxWidth) {
  this.yPadding = 20;
  this.items = [];
  this.height = 0;
  this.width = maxWidth;
};

$.extend(Studio.Alignment.Column.prototype, {

  appendItem: function (item) {
    this.items.push(item);
    this.height += item.height;
    if (item.width > this.width) {
      this.width = item.width;
    }
  },

  offsetItems: function (left) {
    var top = this.yPadding;
    for (var i = 0; i < this.items.length; ++i) {
      var item = this.items[i];
      item.left = left + Math.floor((this.width - item.width) / 2);
      item.top = top;
      top += item.height + this.yPadding;
    }
  }
});