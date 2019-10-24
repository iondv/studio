"use strict";

Studio.DeployModuleRegistryForm = function ($modal, studio) {
  this.globalKeys = ['defaultPath', 'inlineForm', 'logo', 'statics'];
  Studio.DeployModuleForm.apply(this, arguments);
};

$.extend(Studio.DeployModuleRegistryForm.prototype, Studio.DeployModuleForm.prototype, {
  constructor: Studio.DeployModuleRegistryForm,

  getDefaultValues: function () {
    var data = Studio.DeployModuleForm.prototype.getDefaultValues.apply(this, arguments);
    return this.resolvePackData(data);
  },

  getData: function () {
    var data = Studio.DeployModuleForm.prototype.getData.call(this);
    return this.resolvePackData(data);
  },

  resolvePackData: function (data) {
    return this.packData(this.globalKeys, 'globals', data);
  },

  setData: function (data) {
    data = this.unpackData(this.globalKeys, 'globals', data);
    return Studio.DeployModuleForm.prototype.setData.call(this, data);
  },

  getBehaviorMap: function () {
    return {
      'clearFileStore': {}
    };
  },

  onChangeAttr: function (attr) {
    if (this.app) {
      if (attr === this.attrMap.logoFile) {
        this.onChangeLogoFile();
      }
    }
  },

  onChangeLogoFile: function () {
    this.attrMap.logoFile.getValue()
      ? this.setDefaultLogoFileData()
      : this.clearLogoFileData();
  },

  setDefaultLogoFileData: function () {
    this.attrMap.logo.setValue('common-static/logo.png');
    var data = this.attrMap.statics.getValue() || {};
    data['common-static'] = 'applications/'+ this.app.getName() +'/templates/static';
    this.attrMap.statics.setValue(data);
  },

  clearLogoFileData: function () {
    this.attrMap.logo.clearValue();
  }
});