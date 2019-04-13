"use strict";

Studio.DateFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.DateFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.DateFormAttr,

});

Studio.DateTimeFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

Studio.DateTimeFormAttr.DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

Studio.DateTimeFormAttr.format = function (date) {
  return moment(date).format(Studio.DateTimeFormAttr.DATE_TIME_FORMAT);
};

$.extend(Studio.DateTimeFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.DateTimeFormAttr,

  init: function () {
    this.$value.datetimepicker($.extend({}, $.fn.datetimepicker.defaultOpts, {
       sideBySide: false
    }));
    this.$value.on('dp.change', this.onChange.bind(this));
  },

  getPicker: function () {
    return this.$value.data('DateTimePicker');
  },

  getRawValue: function () {
    var value = this.$value.val();
    var date = value && this.getPicker().viewDate();
    return Helper.isValidDate(date) ? Studio.DateTimeFormAttr.format(date) : null;
  },

  setValue: function (value) {
    if (value) {
      value = new Date(value);
      value = Helper.isValidDate(value) ? value : null;
    } else {
      value = null;
    }
    this.getPicker().date(value);
  },

  onChange: function () {
    if (!this.$value.val()) {
      this.getPicker().hide();
    }
  }
});