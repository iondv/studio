"use strict";

Studio.CommandsFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.CommandsFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.CommandsFormAttr,

  init: function () {
      //Studio.FormAttr.prototype.init.call(this);
      this.$commands = this.$attr.find('.commands');
      this.params = this.$commands.data('params');
      this.items = this.params.items;
      this.itemMap = Helper.Array.indexByKey('id', this.items);
      this.defaults = this.params.defaults;
      this.$commands.on('click', '.btn', this.onCommand.bind(this));
  },

  clearSelected: function () {
    this.$commands.find('.selected').removeClass('selected');
  },

  findCommand: function (id) {
    return this.$commands.find('[data-command="'+ id +'"]');
  },

  disable: function (state) {
    if (state === this.isDisabled()) {
      return true;
    }
    Studio.FormAttr.prototype.disable.apply(this, arguments);
    const $btn = this.$commands.find('.btn');
    if (state) {
      this.clearSelected();
      $btn.attr('disabled', true);
    } else {
      $btn.removeAttr('disabled');
      this.setDefaults();
    }
  },

  getRawValue: function () {
    if (this.isDisabled()) {
      return null;
    }
    const items = [];
    for (const item of this.$commands.find('.selected')) {
      items.push(this.itemMap[item.dataset.command]);
    }
    return items.length ? items : null;
  },

  setValue: function (value) {
    this.clearSelected();
    if (this.isDisabled()) {
      return undefined;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        this.itemMap[item.id] = item;
        this.findCommand(item.id).toggleClass('selected');
      }
    } else if (value === undefined) {
      this.setDefaults();
    }
  },

  setDefaults: function () {
    for (const id of this.defaults) {
      this.findCommand(id).toggleClass('selected');
    }
  },

  onCommand: function (event) {
    $(event.currentTarget).toggleClass('selected');
    this.triggerChange();
  }
});