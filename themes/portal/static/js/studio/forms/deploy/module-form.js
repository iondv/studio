"use strict";

Studio.DeployModuleForm = function ($modal, studio, ModelClass = Studio.DeployModuleModel) {
  Studio.ModelForm.call(this, $modal, ModelClass, studio);
};

$.extend(Studio.DeployModuleForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.DeployModuleForm,

  create: function (app, defaults) {
    this.app = app;
    this.deploy = this.app.deploy;
    Studio.ModelForm.prototype.create.call(this, defaults);
  },

  update: function (model) {
    this.app = model.app;
    this.deploy = this.app.deploy;
    Studio.ModelForm.prototype.update.apply(this, arguments);
  },

  getValidationRules: function () {
    return {
      'name': [
        ['required'],
        ['uniqueModel', {
          getModel: this.getUniqueModel
        }]
      ],
    };
  },

  getUniqueModel: function (value, validator) {
    return validator.attr.form.deploy.getModuleByKeyValue(value, validator.attr.name);
  },
});