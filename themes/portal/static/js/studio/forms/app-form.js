"use strict";

Studio.AppForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.AppModel, studio);
};

$.extend(Studio.AppForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.AppForm,

  getValidationRules: function () {
    return {
      name: [
        ['required'],
        ['identifier'],
        ['reservedName']
      ],
      version: [
        ['required'],
        ['mask']
      ]
    };
  },

  getBehaviorMap: function () {
    return {
      'customHandler': {
        afterUpdate: this.afterUpdate.bind(this)
      }
    };
  },

  afterUpdate: function (behavior) {
    if (this.isVersionChanged()) {
      this.model.setChangedState(true); // disable auto versioning after manual editing
    }
  },

  isVersionChanged: function () {
    return this.model && this.getValue('version') !== this.model.getVersion();
  },
});