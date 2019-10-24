"use strict";

Studio.DeployGlobalJobForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.DeployGlobalJobModel, studio);
};

$.extend(Studio.DeployGlobalJobForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.DeployGlobalJobForm,

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
      'code': [
        ['required'],
        ['uniqueModel', {
          getModel: this.getUniqueModel
        }]
      ],
    };
  },

  getUniqueModel: function (value, validator) {
    return validator.attr.form.global.getJobByKeyValue(value, validator.attr.name);
  }
});