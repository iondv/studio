"use strict";

Studio.ExportForm = function ($modal, studio) {

  this.recentServiceAddressStoreId = 'SelectExternalServiceFormAttr.ExportForm';

  Studio.Form.call(this, $modal, studio);
};

$.extend(Studio.ExportForm.prototype, Studio.Form.prototype, {
  constructor: Studio.ExportForm,

  init: function () {
    Studio.Form.prototype.init.call(this);
    this.$export = this.$modal.find('.form-export');
    this.$export.click(this.onExport.bind(this));
  },

  show: function (app) {
    this.app = app;
    this.alert.hide();
    this.prepareAttrs();
    this.$modal.modal('show');
  },

  onExport: function () {
    if (!this.validate()) {
      return this.jumpToError();
    }
    this.studio.toggleLoader(true);
    setTimeout(function () {
      var zip = (new Studio.AppDownload(this.app)).execute();
      zip.then(this.post.bind(this), function (err) {
        console.error(err);
        this.studio.toggleLoader(false);
      }.bind(this));
    }.bind(this), 100);
  },

  post: function (blob) {
    var data = this.getData();
    var request = new XMLHttpRequest;
    request.open('POST', data.service);
    request.onreadystatechange = this.onReadyStateChange.bind(this);
    this.setRecentAddress(data.service);
    delete data.service;
    data.uploadfile = blob;
    var formData = this.getFormData(data);
    request.send(formData);
  },

  getRecentAddress: function () {
    return store.get(this.recentServiceAddressStoreId);
  },

  setRecentAddress: function (address) {
    store.set(this.recentServiceAddressStoreId, address);
  },

  onReadyStateChange: function (event) {
    var xhr = event.target;
    if (xhr.readyState === 4) {
      xhr.status === 200 ? this.done(xhr) : this.fail(xhr);
    }
  },

  done: function (xhr) {
    this.studio.toggleLoader(false);
    var data = Helper.parseJson(xhr.response);
    var err = this.getErrorMessage(data);
    if (err) {
      return this.alert.danger(err);
    }
    this.app.clearChangedState();
    this.alert.success(this.getSuccessMessage(data));
  },

  getErrorMessage: function (data) {
    if (data) {
      if (data.error) {
        return data.error;
      }
      if (data.upload && data.create) {
        if (data.upload.error) {
          return data.upload.error;
        }
        if (data.create.error) {
          return data.create.error;
        }
        return null;
      }
    }
    return this.getFailedMessage();
  },

  getSuccessMessage: function (data) {
    var result = Helper.L10n.translate('Application exported');
    return result;
  },

  getFailedMessage: function (data) {
    return Helper.L10n.translate('Export is failed');
  },

  fail: function (xhr) {
    this.studio.toggleLoader(false);
    var message = xhr.status ? (xhr.status +' '+ xhr.statusText) : this.getFailedMessage();
    this.alert.danger(message);
  },

  getFormData: function (data) {
    var result = new FormData;
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        result.append(key, Helper.stringifyBoolean(data[key]));
      }
    }
    return result;
  },

  getValidationRules: function () {
    return {
      service: [
        ['required']
      ]
    };
  },
});