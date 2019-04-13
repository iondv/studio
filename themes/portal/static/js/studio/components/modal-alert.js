"use strict";

Studio.ModalAlert = function ($modal, studio) {
  this.studio = studio;
  this.$modal = $modal;
  this.$alert = $modal.find('.alert');
  this.init();
};

$.extend(Studio.ModalAlert.prototype, {

  init: function () {
    this.$alert.children('.close').click(this.onClose.bind(this));
  },

  onClose: function (event) {
    this.hide();
  },

  hide: function () {
    this.$modal.modal('hide');
  },

  reset: function () {
    this.$alert.removeClass('alert-info alert-success alert-warning alert-danger');
  },

  info: function (message, title) {
    this.show('alert-info', message, title || Helper.L10n.translate('Info'));
  },

  notice: function (message, title) {
    this.show('alert-info', message, title || Helper.L10n.translate('Notice'));
  },

  success: function (message, title) {
    this.show('alert-success', message, title || Helper.L10n.translate('Success'));
  },

  warning: function (message, title) {
    this.show('alert-warning', message, title || Helper.L10n.translate('Warning'));
  },

  danger: function (message, title) {
    this.show('alert-danger', message, title || Helper.L10n.translate('Error'));
  },

  show: function (type, message, title) {
    this.addMessage(message, title);
    this.reset();
    this.$alert.addClass(type);
    this.$modal.modal('show');
  },

  addMessage: function (message, title) {
    this.$modal.find('.modal-title').html(title || '');
    this.$alert.html(message);
  }
});