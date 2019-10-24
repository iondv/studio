"use strict";

/* DEPLOY */

Studio.DeployModelView = function ($container, studio) {
  Studio.ModelView.call(this, 'deploy', studio.deployForm, $container, studio);
};
$.extend(Studio.DeployModelView.prototype, Studio.ModelView.prototype, {
  constructor: Studio.DeployModelView,

  initListeners: function () {
    Studio.ModelView.prototype.initListeners.call(this);
    this.studio.events.on('updateDeploy', this.redraw.bind(this));
  },

  getModel () {
    return this.studio.getActiveDeploy();
  },
});

/* DEPLOY GLOBAL */

Studio.DeployGlobalModelView = function ($container, studio) {
  Studio.ModelView.call(this, 'deployGlobal', studio.deployGlobalForm, $container, studio);
};
$.extend(Studio.DeployGlobalModelView.prototype, Studio.ModelView.prototype, {
  constructor: Studio.DeployGlobalModelView,

  initListeners: function () {
    Studio.ModelView.prototype.initListeners.call(this);
    this.studio.events.on('updateDeployGlobal', this.redraw.bind(this));
  },

  getModel () {
    return this.studio.getActiveDeployGlobal();
  }
});

/* DEPLOY MODULE */

Studio.DeployModuleModelView = function ($container, studio) {
  Studio.ModelView.call(this, 'deployModule', studio.deployModuleForm, $container, studio);
};
$.extend(Studio.DeployModuleModelView.prototype, Studio.ModelView.prototype, {
  constructor: Studio.DeployModuleModelView,

  initListeners: function () {
    Studio.ModelView.prototype.initListeners.call(this);
    this.studio.events.on('changeActiveItem', this.onChangeActiveItem.bind(this));
    this.studio.events.on('updateDeployModule', this.redraw.bind(this));
  },

  getModel () {
    return this.studio.getActiveDeployModule();
  },

  getForm: function () {
    return this.studio.getDeployModuleForm(this.model);
  },

  onChangeActiveItem: function () {
    this.model = this.studio.getActiveDeployModule();
    this.redraw();
  },

  getJsonAttrParams: function ($attr, value, attr) {
    switch (attr.name) {
      case 'authMode': value = this.prepareAuthModeValue(value); break;
    }
    return Studio.ModelView.prototype.getJsonAttrParams.call(this, $attr, value, attr);
  },

  prepareAuthModeValue: function (data) {
    for (let key of Object.keys(data)) {
      if (!data[key]) {
        delete data[key];
      }
    }
    return data;
  }
});