"use strict";

Studio.DeployGlobalTopMenuModel = function (global, data) {
  this.global = global;
  this.app = global.app;
  this.clear();
  Studio.Model.call(this, 'deployGlobalTopMenu:', this.app.studio, data);
};

$.extend(Studio.DeployGlobalTopMenuModel.prototype, Studio.Model.prototype, {
  constructor: Studio.DeployGlobalTopMenuModel,

  getNavSectionTitle: function () {
    var section = this.app.getNavSection(this.data.id);
    return section ? section.getTitle() : '';
  },

  remove: function () {
    this.global.removeTopMenuItem(this);
  },

  exportData: function () {
    let data = {};
    this.replaceIdToNavSectionName('section', data);
    if (data.system) {
      data.type = 'system';
      data.name = this.data.name;
    } else {
      data.id = this.data.id;
      data.url = this.data.url;
      data.caption = this.data.caption;
    }
    return data;
  },

  importData: function (data) {
    data = data || {};
    data.system = data.system || data.type === 'system';
    delete data.type;
    this.setData(data);
  },

  afterImport: function () {
    this.replaceNavSectionNameToId('section', this.data);
  }
});