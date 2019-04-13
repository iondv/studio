"use strict";

Studio.Alert = function ($alert) {
  this.$alert = $alert;
  this.init();
};

$.extend(Studio.Alert.prototype, {

  init: function () {
    this.$alert.children('.close').click(this.onClose.bind(this));
    this.hide();
  },

  onClose: function (event) {
    this.hide();
  },

  hide: function () {
    return this.$alert.hide();
  },

  reset: function () {
    this.$alert.removeClass('alert-info alert-success alert-warning alert-danger');
  },

  info: function (message) {
    this.show('alert-info', message);
  },

  success: function (message) {
    this.show('alert-success', message);
  },

  warning: function (message) {
    this.show('alert-warning', message);
  },

  danger: function (message) {
    this.show('alert-danger', message);
  },

  show: function (type, message) {
    this.addMessage(message);
    this.reset();
    this.$alert.addClass(type).show();
  },

  addMessage: function (message) {
    this.$alert.children('.alert-content').html(message);
  }
});