"use strict";

Studio.EntryFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.EntryFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.EntryFormAttr,

  init: function () {
    Studio.FormAttr.prototype.init.call(this);
    this.$entry = this.$attr.find('.entry');
    this.$list = this.$entry.find('.entry-list');
    this.itemContent = this.$entry.find('template').html();
    this.$entry.on('click', '.entry-new', this.onNew.bind(this));
    this.$entry.on('click', '.entry-item-new', this.onNewItem.bind(this));
    this.$entry.on('click', '.entry-item-remove', this.onRemoveItem.bind(this));
  },

  getValue: function () {
    return this.serialize();
  },

  getRawValue: function () {
    return JSON.stringify(this.serialize());
  },

  setValue: function (items) {
    this.$list.empty();
    this.createItems(items);
    this.refresh();
  },

  createItems: function (items) {
    if (Array.isArray(items)) {
      let last = null;
      for (const item of items) {
        last = new Studio.EntryItem(this, this, last);
        last.setValue(item);
      }
    }
  },

  getItem: function (element) {
    return $(element).closest('.entry-item').data('item');
  },

  getItems: function () {
    const items = [];
    for (const item of this.$list.children()) {
      items.push($(item).data('item'));
    }
    return items;
  },

  onNew: function (event) {
    new Studio.EntryItem(this, this);
    this.triggerChange();
  },

  onNewItem: function (event) {
    const sender = this.getItem(event.currentTarget);
    new Studio.EntryItem(this, sender.parent, sender);
    this.triggerChange();
  },

  onRemoveItem: function (event) {
    this.getItem(event.currentTarget).$item.remove();
    this.triggerChange();
  },

  onChange: function (event) {
    Studio.FormAttr.prototype.onChange.call(this, event);
    this.refresh();
  },

  refresh: function () {
    this.$entry.toggleClass('empty', !this.$list.children().length);
  },

  appendItem: function ($item) {
    this.$list.prepend($item);
  },

  serialize: function () {
    return this.getItems().map(item => item.serialize()).filter(item => !!item);
  }
});

Studio.EntryItem = function (attr, parent, sender) {
  this.attr = attr;
  this.parent = parent;
  this.$item = $(this.attr.itemContent);
  Helper.L10n.translateContainer(this.$item);
  sender ? sender.insertAfter(this.$item) : parent.appendItem(this.$item);
  this.$key = this.$item.find('.entry-item-key').find('input');
  this.$value = this.$item.find('.entry-item-value').find('input');
  this.$item.data('item', this);
};

$.extend(Studio.EntryItem.prototype, {

  insertAfter: function ($item) {
    this.$item.after($item);
  },

  setValue: function (data) {
    this.data = data;
    if (data) {
      this.$key.val(data.key);
      this.$value.val(data.value);
    }
  },

  serialize: function () {
    const data = this.data || {};
    data.key = this.$key.val().trim();
    data.value = this.$value.val().trim();
    return data.key && data.value ? data : null;
  }
});

Studio.SelectionEntryFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.SelectionEntryFormAttr.prototype, Studio.EntryFormAttr.prototype, {
  constructor: Studio.SelectionEntryFormAttr,

  setValue: function (data) {
    this.$list.empty();
    this.data = data;
    if (data) {
      this.createItems(data.list);
    }
    this.refresh();
  },

  serialize: function () {
    const items = Studio.EntryFormAttr.prototype.serialize.call(this);
    if (!items.length) {
      return null;
    }
    const data = this.data || {
      type: 'SIMPLE',
      list: null,
      matrix: [],
      parameters: [],
      hg: ''
    };
    data.list = items;
    return data;
  }
});