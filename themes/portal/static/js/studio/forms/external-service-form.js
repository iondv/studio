"use strict";

Studio.ExternalServiceForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.ExternalServiceModel, studio);
};

$.extend(Studio.ExternalServiceForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.ExternalServiceForm,

  getValidationRules: function () {
    return {
      name: [
        ['required'],
        ['unique']
      ],
      address: [
        ['required'],
        ['unique']
      ]
    };
  }
});
