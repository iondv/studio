"use strict";

Studio.DeployForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.DeployModel, studio);
};

$.extend(Studio.DeployForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.DeployForm,

  create: function (app, defaults) {
    this.app = app;
    Studio.ModelForm.prototype.create.call(this, defaults);
  },

  update: function (model) {
    this.app = model.app;
    this.deploy = model;
    Studio.ModelForm.prototype.update.apply(this, arguments);
  },

  getValidationRules: function () {
    return {
      namespace: [
        ['required'],
        ['identifier']
      ]
    };
  }
});