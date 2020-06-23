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
    this.modal.$modal.on('click', '[data-action="refresh"]', this.onRefresh.bind(this));
    this.studio.events.on('sandbox:ready', this.onReadyStatus.bind(this));
    this.studio.events.on('sandbox:stopped', this.onStoppedStatus.bind(this));
    this.studio.events.on('sandbox:pending', this.onPendingStatus.bind(this));
    this.studio.$main.on('click', '[data-sandbox="try"]', this.onTryClick.bind(this));
    this.studio.$main.on('click', '[data-sandbox="pending"]', this.onPendingClick.bind(this));
    this.studio.$main.on('click', '[data-sandbox="ready"]', this.onReadyClick.bind(this));
    this.studio.events.one('changeActiveItem', this.onToggleApp.bind(this));
  },

  getPlayUrl: function () {
    return this.data.url +'/'+ this.getClientId();
  },

  onToggleApp: function () {
    if (this.studio.getActiveApp()) {
      this.requestWatching();
    }
  },

  onPlay: function () {
    const app = this.studio.getActiveApp();
    if (app) {
      this.showLoader();
      $.get(this.getPlayUrl())
        .always(this.hideLoader.bind(this))
        .done(this.onDonePlay.bind(this))
        .done(this.onDoneWatching.bind(this))
        .fail(this.onFailPlay.bind(this))
        .fail(this.onFailWatching.bind(this));
    }
  },

  onDonePlay: function (data) {
    if (!data || !data.state) {
      return this.showError('Invalid response');
    }
    if (data.state === 'stopped') {
      return this.renderStopped(data);
    }
    if (data.url) {
      return this.renderReady(data);
    }
    data.message = Helper.L10n.translate(data.stateText || data.state);
    data.refresh = this.resolveTemplate('sandbox-refresh');
    data.redeploy = this.resolveTemplate('sandbox-redeploy');
    this.showModalTemplate('sandbox-info', data);
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

  renderStopped: function (data) {
    data.redeploy = this.resolveTemplate('sandbox-redeploy');
    this.showModalTemplate('sandbox-stopped', data);
  },

  deploy: function () {
    const app = this.studio.getActiveApp();
    if (app) {
      this.abortWatching();
      this.setNotification('pending');
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
    data.append('name', this.getBlobName());
    data.append('app', blob);
    xhr.send(data);
  },

  onBlobChangeState: function (xhr) {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      this.hideLoader();
      if (xhr.status === 413) {
        return this.showError('Application file size exceeds 1 Mb');
      }
      if (xhr.status !== 200) {
        return this.showError(xhr.statusText);
      }
      const data = xhr.response;
      data.refresh = this.resolveTemplate('sandbox-refresh');
      this.showModalTemplate('sandbox-pending', data);
      this.watch();
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

  onRefresh: function () {
    this.showLoader();
    this.requestWatching()
      .always(this.hideLoader.bind(this))
      .done(this.onDoneWatching.bind(this));
  },

  showLoader: function () {
    this.studio.toggleLoader(true);
  },

  hideLoader: function () {
    this.studio.toggleLoader(false);
  },

  getBlobName: function () {
    return this.studio.getActiveApp().getName();
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
  },

  watch: function () {
    this.abortWatching();
    this._watchingTimer = setTimeout(this.requestWatching.bind(this), 15000);
  },

  abortWatching: function () {
    if (this._watchingTimer) {
      clearTimeout(this._watchingTimer);
    }
    if (this._watchingRequest) {
      this._watchingRequest.abort();
    }
  },

  requestWatching: function () {
    this.abortWatching();
    this._watchingRequest = $.get(this.getPlayUrl())
      .done(this.onDoneWatching.bind(this))
      .fail(this.onFailWatching.bind(this));
    return this._watchingRequest;
  },

  onDoneWatching: function (data) {
    if (!data || !data.state) {
      return null;
    }
    let event = null;
    if (data.state === 'stopped') {
      event = 'sandbox:stopped';
    } else if (data.url) {
      event = 'sandbox:ready';
    } else {
      event = 'sandbox:pending';
      this.watch();
    }
    this.studio.events.trigger(event, data);
  },

  onFailWatching: function (xhr) {
      if (xhr.status === 404) {
        this.studio.events.trigger('sandbox:stopped');
      }
  },

  onPendingStatus: function (event, data) {
    if (this.modal.isShown()) {
      this.onDonePlay(data);
    }
  },

  onReadyStatus: function (event, data) {
    this.setNotification('ready', data);
    if (this.modal.isShown()) {
      this.onDonePlay(data);
    }
  },

  onStoppedStatus: function (event, data) {
    this.setNotification('try');
  },

  clearNotification: function () {
    this.$play.parent().find('.sandbox-message').remove();
  },

  setNotification: function (type, data) {
    this.clearNotification();
    this.$play.before(this.resolveTemplate('sandbox-message-'+ type, data));
  },

  onReadyClick: function (event) {
    const url = $(event.currentTarget).data('url');
    url ? window.open(url, '_blank').focus() : this.onPlay();
  },

  onTryClick: function () {
    this.onPlay();
  },

  onPendingClick: function (event) {
    this.onPlay();
  }
});