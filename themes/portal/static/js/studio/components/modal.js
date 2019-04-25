"use strict";

Studio.Modal = function ($modal, studio) {
  this.studio = studio;
  this.$modal = $modal;
  this.init();
};

$.extend(Studio.Modal.prototype, {

  init: function () {
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
    var $container = this.$modal.find('.modal-loadable');
    if ($container.length && !$container.hasClass('loading')) {
      $container.addClass('loading');
      $.get($container.data('url')).always(function () {
        $container.addClass('loaded');
      }).done(function (data) {
        $container.find('.loadable-content').html(data);
      });
    }
  }
});