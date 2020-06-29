"use strict";

Studio.Modal = function ($modal, studio) {
  this.studio = studio;
  this.$modal = $modal;
  this.init();
};

$.extend(Studio.Modal.prototype, {

  init: function () {
  },

  isShown: function () {
    return this.$modal.is(':visible');
  },

  onClose: function (event) {
    this.hide();
  },

  hide: function () {
    this.$modal.modal('hide');
  },

  show: function () {
    this.execLoadable();
    this.$modal.modal('show');
  },

  execLoadable: function () {
    const $container = this.$modal.find('.modal-loadable');
    if ($container.length && !$container.hasClass('loading')) {
      $container.addClass('loading');
      $.get($container.data('url')).always(function () {
        $container.addClass('loaded');
      }).done(function (data) {
        $container.find('.loadable-content').html(data);
      });
    }
  },

  appendAlert: function (type, content) {
    return this.appendContent(this.renderAlert(type, content));
  },

  setAlert: function (type, content) {
    return this.setContent(this.renderAlert(type, content));
  },

  renderAlert: function (type, content) {
    content = Helper.L10n.translate(content);
    return '<div class="alert alert-'+ type +'">'+ content +'</div>';
  },

  appendContent: function (content) {
    this.$modal.find('.modal-body').append(content);
    return this;
  },

  setContent: function (content) {
    this.$modal.find('.modal-body').html(content);
    return this;
  }
});