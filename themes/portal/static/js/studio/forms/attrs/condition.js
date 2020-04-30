"use strict";

Studio.ConditionFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.ConditionFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.ConditionFormAttr,

  init: function () {
    Studio.FormAttr.prototype.init.call(this);
    this.$conditions = this.$attr.find('.conditions');
    this.classAttrNames = this.$conditions.data('classAttrs').split(',');
    this.$list = this.$conditions.find('.condition-list');
    this.itemContent = this.$conditions.find('template').html();
    this.$conditions.on('click', '.condition-new', this.onNew.bind(this));
    this.$conditions.on('click', '.condition-item-new', this.onNewItem.bind(this));
    this.$conditions.on('click', '.condition-item-nested', this.onNestItem.bind(this));
    this.$conditions.on('click', '.condition-item-toggle', this.onToggleItem.bind(this));
    this.$conditions.on('click', '.condition-item-remove', this.onRemoveItem.bind(this));
  },

  getValue: function () {
    return this.serialize();
  },

  getRawValue: function () {
    return JSON.stringify(this.serialize());
  },

  setValue: function (items) {
    this.$list.empty();
    if (Array.isArray(items)) {
      let last = null;
      for (const item of items) {
        last = new Studio.ConditionItem(this, this, last);
        last.setValue(item);
      }
    }
    this.refresh();
  },

  getItem: function (element) {
    return $(element).closest('.condition-item').data('item');
  },

  getItems: function () {
    const items = [];
    for (const item of this.$list.children()) {
      items.push($(item).data('item'));
    }
    return items;
  },

  onNew: function (event) {
    new Studio.ConditionItem(this, this);
    this.triggerChange();
  },

  onNewItem: function (event) {
    const sender = this.getItem(event.currentTarget);
    new Studio.ConditionItem(this, sender.parent, sender);
    sender.toggle(false);
    this.triggerChange();
  },

  onNestItem: function (event) {
    const parent = this.getItem(event.currentTarget);
    new Studio.ConditionItem(this, parent);
    parent.toggle(true);
    this.triggerChange();
  },

  onToggleItem: function (event) {
    this.getItem(event.currentTarget).toggle();
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
    this.$conditions.toggleClass('empty', !this.$list.children().length);
    this.getItems().forEach(item => item.refresh());
  },

  appendItem: function ($item) {
    this.$list.prepend($item);
  },

  serialize: function () {
    return this.getItems().map(item => item.serialize()).filter(item => !!item);
  }
});

Studio.ConditionItem = function (attr, parent, sender) {
  this.attr = attr;
  this.parent = parent;
  this.$item = $(this.attr.itemContent);
  Helper.L10n.translateContainer(this.$item);
  sender ? sender.insertAfter(this.$item) : parent.appendItem(this.$item);
  this.$nested = this.$item.find('.condition-item-body');
  this.$property = this.$item.find('.condition-item-property').find('input');
  this.$operation = this.$item.find('.condition-item-operation').find('select');
  this.$value = this.$item.find('.condition-item-value').find('input');
  this.createPropertyAutocomplete();
  Helper.select2(this.$operation);
  this.$item.data('item', this);
};

$.extend(Studio.ConditionItem.prototype, {

  getItems: function () {
    const items = [];
    for (const item of this.$nested.children()) {
      items.push($(item).data('item'));
    }
    return items;
  },

  appendItem: function ($item) {
    this.$nested.append($item);
  },

  insertAfter: function ($item) {
    this.$item.after($item);
  },

  toggle: function (state) {
    this.$item.toggleClass('opened', state);
  },

  refresh: function () {
    this.$item.toggleClass('empty', !this.$nested.children().length);
    this.getItems().forEach(item => item.refresh());
  },

  createPropertyAutocomplete: function () {
    this.$property.autocomplete({
      appendTo: this.attr.form.$modal,
      minLength: 0,
      source: []
    }).focus(() => {
      const props = this.getClassPropertyNames();
      this.$property.autocomplete('option', 'source', props);
      this.$property.autocomplete('search', this.$property.val());
    });
  },

  getClassPropertyNames: function () {
    for (const name of this.attr.classAttrNames) {
      const attr = this.attr.form.getAttr(name);
      const id = attr ? attr.getValue() : null;
      const cls = this.attr.form.app.getClass(id);
      if (cls) {
        return cls.getAttrNames();
      }
    }
    return [];
  },

  setValue: function (data) {
    if (data) {
      this.$property.val(data.property);
      this.$operation.val(data.operation).change();
      const value = Array.isArray(data.value) ? '['+ data.value + ']' : data.value;
      this.$value.val(value);
      if (Array.isArray(data.nestedConditions)) {
        let last = null;
        for (const item of data.nestedConditions) {
          last = new Studio.ConditionItem(this.attr, this, last);
          last.setValue(item);
        }
      }
    }
  },

  serialize: function () {
    const property = this.$property.val().trim();
    const operation = parseInt(this.$operation.val());
    if (!property || !operation) {
      return null;
    }
    let value = this.$value.val().trim();
    if (value === '') {
      value = null;
    } else if (/^\[.+\]$/.test(value)) {
      value = [value.substring(1, value.length - 1)];
    }
    const nestedConditions = this.getItems().map(item => item.serialize()).filter(item => !!item);
    return {property, operation, value, nestedConditions};
  }
});