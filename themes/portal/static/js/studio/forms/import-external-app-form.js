"use strict";

Studio.ImportExternalAppForm = function ($modal, studio) {

  Studio.Form.call(this, $modal, studio);
};

$.extend(Studio.ImportExternalAppForm.prototype, Studio.Form.prototype, {
  constructor: Studio.ImportExternalAppForm,

  init: function () {
    Studio.Form.prototype.init.call(this);
    this.$import = this.$modal.find('.form-import');
    this.$import.click(this.onImport.bind(this));
  },

  getBehaviorMap: function () {
    return {
      'customHandler': {
        beforeShow: this.beforeShow.bind(this)
      }
    };
  },

  beforeShow: function () {
    this.buildItems(this.getItems());
  },

  buildItems: function (items) {
    const options = ['<option value=""></option>'];
    for (const item of items) {
      options.push('<option value="'+ item.url +'">'+ item.title +'</option>')
    }
    this.getItemAttr().$value.html(options.join('')).val('');
  },

  getItemAttr: function () {
    return this.getAttr('item');
  },

  getUrlAttr: function () {
    return this.getAttr('url');
  },

  getItemByUrl: function (url) {
    for (const item of this.getItems()) {
      if (item.url === url) {
        return item;
      }
    }
  },

  getItems: function () {
    const language = Helper.L10n.getLanguage();
    return this.params.items.filter(function (item) {
      return !item.language || item.language === language;
    }, this);
  },

  onImport: function () {
    if (!this.validate()) {
      return this.jumpToError();
    }
    this.studio.toggleLoader(true);
    const xhr = new XMLHttpRequest;
    xhr.open('GET', this.getSelectedUrl(), true);
    xhr.responseType = 'arraybuffer';
    xhr.addEventListener('load', function (event) {
      xhr.status === 200
        ? this.onDone(xhr.response)
        : this.onFail(xhr);
    }.bind(this));
    xhr.addEventListener('error', function () {
      this.onFail(xhr);
    }.bind(this));
    xhr.send();
  },

  getSelectedUrl: function () {
    const item = this.getItemByUrl(this.getItemAttr().getValue());
    return item ? item.url : this.getUrlAttr().getValue();
  },

  onDone: function (data) {
    this.studio.toggleLoader(false);
    (new Studio.AppImport(data, this.studio)).execute();
    this.hide();
  },

  onFail: function (xhr) {
    this.studio.toggleLoader(false);
    const message = xhr.status ? (xhr.status +' '+ xhr.statusText) : this.getFailedMessage();
    this.alert.danger(message);
  },

  getFailedMessage: function (data) {
    return Helper.L10n.translate('Invalid response');
  },

  getValidationRules: function () {
    return {
      item: [
        ['required', {
          when: function () {
            return this.getUrlAttr().isEmpty();
          }.bind(this)
        }]
      ]
    };
  }
});