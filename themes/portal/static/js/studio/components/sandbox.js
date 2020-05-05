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
    this.modal = new Studio.Modal($('#sandbox-modal'), this.studio);
    this.modal.$modal.on('click', '[data-action="redeploy"]', this.onRedeploy.bind(this));
  },

  onPlay: function () {
    const app = this.studio.getActiveApp();
    if (app) {
      this.showLoader();
      $.get(this.data.url +'/'+ this.getClientId())
        .always(this.hideLoader.bind(this))
        .done(this.onDonePlay.bind(this))
        .fail(this.onFailPlay.bind(this));
    }
  },

  onDonePlay: function (data) {
    if (!data || !data.state) {
      return this.showError('Invalid response');
    }
    if (data.url) {
      return this.renderReady(data);
    }
    const text = Helper.L10n.translate(data.stateText || data.state);
    this.showAlert('info', text);
  },

  onFailPlay: function (data) {
    if (data.status === 404) {
      return this.deploy();
    }
    this.showError(data.responseText || data.statusText);
  },

  renderReady: function (data) {
    data.limits = '';
    if (data.endTime) {
      data.end = Helper.Format.timestamp(new Date(parseInt(data.endTime)));
      data.limits += this.resolveTemplate('sandbox-limit-end', data);
    }
    if (data.rebuildTime) {
      data.rebuildTime = parseInt(data.rebuildTime);
      data.repeat = Helper.Format.timestamp(new Date(data.rebuildTime));
      data.limits += this.resolveTemplate('sandbox-limit-repeat', data);
    }
    if (!data.repeat || data.rebuildTime < Date.now()) {
      data.redeploy = this.resolveTemplate('sandbox-redeploy');
    }
    if (data.limits) {
      data.limits = this.resolveTemplate('sandbox-limits', data);
    }
    this.showModalTemplate('sandbox-ready', data);
  },

  deploy: function () {
    const app = this.studio.getActiveApp();
    if (app) {
      this.showLoader();
      (new Studio.AppDownload(app)).execute()
        .then(this.onBlob.bind(this), this.onFailBlob.bind(this));
    }
  },

  onBlob: function (blob) {
    const xhr = new XMLHttpRequest;
    xhr.open('POST', this.data.url);
    xhr.responseType = 'json';
    //xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = this.onBlobChangeState.bind(this, xhr);
    const data = new FormData;
    data.append('cid', this.getClientId());
    data.append('token', this.getToken());
    //data.append('app', this.getBlobName());
    data.append('app', blob);
    xhr.send(data);
  },

  onBlobChangeState: function (xhr) {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      this.hideLoader();
      if (xhr.status !== 200) {
        return this.showError(xhr.statusText);
      }
      this.showModalTemplate('sandbox-pending', xhr.response);
    }
  },

  onFailBlob: function (data) {
    this.hideLoader();
    this.showError(data.responseText || data.statusText);
  },

  onRedeploy: function () {
    this.modal.hide();
    this.deploy();
  },

  showLoader: function () {
    this.studio.toggleLoader(true);
  },

  hideLoader: function () {
    this.studio.toggleLoader(false);
  },

  getBlobName: function () {
    return 'sandbox.zip';
  },

  getToken: function () {
    return this.data.token;
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
    return Helper.getRandom(0x1000000000, 0x9999999999).toString(16);
  },

  showError: function (text) {
    this.showAlert('danger', text);
  },

  showAlert: function (type, text) {
    this.modal.setAlert(type, text).show();
  },

  showModalTemplate: function (name, data) {
    const content = this.resolveTemplate(name, data);
    this.modal.setContent(content).show();
    Helper.L10n.translateContainer(this.modal.$modal);
  },

  resolveTemplate: function (name, data) {
    const $template = $('template').filter('[data-id="'+ name +'"]');
    return Helper.resolveTemplate($template.html(), data);
  }
});
