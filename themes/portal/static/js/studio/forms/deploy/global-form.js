"use strict";

Studio.DeployGlobalForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.DeployGlobalForm, studio);
};

$.extend(Studio.DeployGlobalForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.DeployGlobalForm,

  create: function (app, defaults) {
    this.app = app;
    Studio.ModelForm.prototype.create.call(this, defaults);
  },

  update: function (model) {
    this.app = model.app;
    Studio.ModelForm.prototype.update.apply(this, arguments);
  },

  getValidationRules: function () {
    return {
    };
  }
});