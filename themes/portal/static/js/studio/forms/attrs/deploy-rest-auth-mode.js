"use strict";

Studio.DeployRestAuthModeFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
  this.$tbody = this.$attr.find('tbody');
};

$.extend(Studio.DeployRestAuthModeFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.DeployRestAuthModeFormAttr,

  init () {
    Studio.FormAttr.prototype.init.call(this);
  },

  getRawValue: function () {
    var result = this.oldData || {};
    this.getRows().each(function (index, row) {
      var data = this.getRowData($(row));
      result[data.name] = data.active ? data.type : false;
    }.bind(this));
    return result;
  },

  getRowData: function ($row) {
    var id = $row.data('id');
    return {
      active: this.getRowActiveElement(id).is(':checked'),
      name: this.getRowNameElement(id).val(),
      type: this.getRowTypeElement(id).val()
    };
  },

  getRows: function () {
    return this.$tbody.children();
  },

  getRow: function (id) {
    return this.getRows().filter('[data-id="'+ id +'"]');
  },

  getRowActiveElement: function (id) {
    return this.getRow(id).find('[name="active"]');
  },

  getRowNameElement: function (id) {
    return this.getRow(id).find('[name="name"]');
  },

  getRowTypeElement: function (id) {
    return this.getRow(id).find('[name="type"]');
  },

  setValue: function (value) {
    this.oldData = value;
    if (value) {
      this.getRows().each(function (index, row) {
        var id = $(row).data('id');
        var $active = this.getRowActiveElement(id).prop('checked', false);
        var $name = this.getRowNameElement(id).val(id);
        var $type = this.getRowTypeElement(id).val('header');
        if (id === 'custom') {
          var name = this.getCustomName(value);
          if (name) {
            $active.prop('checked', true);
            $name.val(name);
            $type.val(value[name]);
          }
        } else if (value.hasOwnProperty(id)) {
          $active.prop('checked', true);
          $type.val(value[id]);
        }
      }.bind(this));
    }
  },

  getCustomName: function (value) {
    for (var name of Object.keys(value)) {
      if (name !== 'crud' && name !== 'acceptor') {
        return name;
      }
    }
  }
});