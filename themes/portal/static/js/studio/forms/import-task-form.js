"use strict";

Studio.ImportTaskForm = function ($modal, studio) {

  this.recentServiceAddressStoreId = 'SelectExternalServiceFormAttr.ImportTaskForm';

  Studio.Form.call(this, $modal, studio);
};

$.extend(Studio.ImportTaskForm.prototype, Studio.Form.prototype, {
  constructor: Studio.ImportTaskForm,

  init: function () {
    Studio.Form.prototype.init.call(this);
    this.$import = this.$modal.find('.form-import');
    this.$import.click(this.onImport.bind(this));
  },

  show: function (app) {
    this.app = app;
    this.alert.hide();
    this.prepareAttrs();
    this.$modal.modal('show');
  },

  onImport: function () {
    if (!this.validate()) {
      return this.jumpToError();
    }
    this.studio.toggleLoader(true);
    var url = this.getValue('service');
    this.setRecentAddress(url);
    $.get(url).done(this.done.bind(this)).fail(this.fail.bind(this));
  },

  done: function (data) {
    this.studio.toggleLoader(false);
    data = this.parseData(data);
    if (data instanceof Array) {
      data.forEach(this.importTask.bind(this));
      this.studio.triggerChangeModel(this.app);
      this.studio.menu.updateTasks(this.app);
      this.studio.taskArea.redraw();
      this.alert.success(Helper.L10n.translate('Tasks imported'));
    } else {
      this.alert.danger(this.getFailedMessage());
    }
  },

  fail: function (xhr) {
    this.studio.toggleLoader(false);
    var message = xhr.status ? (xhr.status +' '+ xhr.statusText) : this.getFailedMessage();
    this.alert.danger(message);
  },

  parseData: function (data) {
    try {
      data = JSON.parse(data);
      return data.metric_info;
    } catch (err) {
    }
  },

  getFailedMessage: function (data) {
    return Helper.L10n.translate('Invalid response');
  },

  importTask: function (data) {
    data = {
      'code': data.code,
      'title': data.title,
      'active': data.active,
      'interval': data.interval_min,
      'startDate': this.formatDate(data.start_date_def),
      'endDate': this.formatDate(data.end_date_def)
    };
    var task = this.app.getTaskByCode(data.code);
    task ? task.setData(data) : this.app.createTask(data);
  },

  formatDate: function (value) {
    return value ? Studio.DateTimeFormAttr.format(value) : null;
  },

  getRecentAddress: function () {
    return store.get(this.recentServiceAddressStoreId);
  },

  setRecentAddress: function (address) {
    store.set(this.recentServiceAddressStoreId, address);
  },

  getValidationRules: function () {
    return {
      service: [
        ['required']
      ]
    };
  },
});