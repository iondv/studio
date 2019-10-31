"use strict";

Studio.DeployModuleRestForm = function ($modal, studio) {
  this.globalKeys = ['authMode'];
  Studio.DeployModuleForm.apply(this, arguments);
};

$.extend(Studio.DeployModuleRestForm.prototype, Studio.DeployModuleForm.prototype, {
  constructor: Studio.DeployModuleRestForm,

  getDefaultValues: function () {
    let data = Studio.DeployModuleForm.prototype.getDefaultValues.apply(this, arguments);
    return this.resolvePackData(data);
  },

  getData: function () {
    let data = Studio.DeployModuleForm.prototype.getData.call(this);
    data = this.resolvePackData(data);
    return data;
  },

  setData: function (data) {
    data = this.unpackData(this.globalKeys, 'globals', data);
    this.setHeaderAuthModes(data);
    return Studio.DeployModuleForm.prototype.setData.call(this, data);
  },

  resolvePackData: function (data) {
    data = this.packData(this.globalKeys, 'globals', data);
    this.resolveAuthModes(data);
    return data;
  },

  resolveAuthModes: function (data) {
    data.globals = data.globals || {};
    data = data.globals;
    data.authMode = data.authMode || {};
    data.di = data.di || {};
    for (var key of Object.keys(data.authMode)) {
      if (data.authMode[key]) {
        data.di[key] = Object.assign(this.getDefaultServiceData(key), data.di[key]);
        if (data.authMode[key] === 'header') {
          delete data.authMode[key];
        }
      } else {
        delete data.di[key];
        delete data.authMode[key];
      }
    }
  },

  getDefaultServiceData: function (key) {
    switch (key) {
      case 'acceptor':
        return {
          module: 'modules/rest/lib/impl/acceptor'
        };
      case 'crud':
        return {
          module: 'modules/rest/lib/impl/crud',
          options: {
            auth: 'ion://auth',
            dataRepo: 'ion://dataRepo'
          }
        };
    }
    return {module: 'applications/' + this.app.getName() + '/service/' + key};
  },

  setHeaderAuthModes: function (data) {
    var di = data.globals && data.globals.di || {};
    data.authMode = data.authMode || {};
    for (var key of Object.keys(di)) {
      if (!data.authMode.hasOwnProperty(key)) {
        data.authMode[key] = 'header';
      }
    }
  }
});