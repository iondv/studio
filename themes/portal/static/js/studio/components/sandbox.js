"use strict";

Studio.Sandbox = function (studio, data) {
  this.STORE_CLIENT_ID = 'iondv-studio-sandbox-cid';
  this.studio = studio;
  this.data = data;
};

$.extend(Studio.Sandbox.prototype, {

  initListeners: function () {
    this.$play = this.studio.toolbar.getTool('play');
    this.$play.click(this.onPlay.bind(this));
  },

  onPlay: function () {
    const app = this.studio.getActiveApp();
    if (app) {
      (new Studio.AppDownload(app)).execute().then(function (blob) {
        blob
      });
    }
  },

  onFail: function (data) {

  },

  getClientId: function () {
    let id = store.get(this.STORE_CLIENT_ID);
    if (!id) {
      id = this.createClientId();
      store.set(this.STORE_CLIENT_ID, id);
    }
    return id;
  },

  createClientId: function () {
    return Helper.getRandom(68719476736, 1099511627775).toString(16);
  },

  ajax: function (url, data) {
    return $.ajax({
      'url': url,
      'data': JSON.stringify(data),
      'method': 'post',
      'dataType': 'json',
      'contentType': 'application/json',
    });
  }
});
