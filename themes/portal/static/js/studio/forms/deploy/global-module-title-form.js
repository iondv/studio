"use strict";

Studio.DeployGlobalModuleTitleForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.DeployGlobalModuleTitleModel, studio);
};

$.extend(Studio.DeployGlobalModuleTitleForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.DeployGlobalModuleTitleForm,

  create: function (app, defaults) {
    this.app = app;
    this.global = this.app.deploy.global;
    Studio.ModelForm.prototype.create.call(this, defaults);
  },

  update: function (model) {
    this.app = model.app;
    this.global = this.app.deploy.global;
    Studio.ModelForm.prototype.update.apply(this, arguments);
  },

  getValidationRules: function () {
    return {
      type: [
        ['required'],
        ['uniqueModel', {
          getModel: this.getUniqueModel
        }]
      ],
    };
  },

  getUniqueModel: function (value, validator) {
    return validator.attr.form.global.getModuleTitleByKeyValue(value, validator.attr.name);
  },

  getBehaviorMap: function () {
    return {
      'modelOrderNumber': {
        propName: 'order',
        getModels: function (behavior) {
          return behavior.owner.global.moduleTitles;
        }
      }
    };
  },

});