"use strict";

Studio.NavSectionForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.NavSectionModel, studio);
};

$.extend(Studio.NavSectionForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.NavSectionForm,

  create: function (app, defaults) {
    this.app = app;
    Studio.ModelForm.prototype.create.call(this, defaults);
  },

  update: function (model) {
    this.app = model.app;
    this.workflow = model;
    Studio.ModelForm.prototype.update.apply(this, arguments);
  },

  getValidationRules: function () {
    return {
      name: [
        ['required'],
        ['identifier'],
        ['uniqueModel', {
          getModel: this.getUniqueModel
        }]
      ],
      caption: [
        ['required'],
        ['uniqueModel', {
          getModel: this.getUniqueModel
        }]
      ]
    };
  },

  getUniqueModel: function (value, validator) {
    return validator.attr.form.app.getNavSectionByKeyValue(value, validator.attr.name);
  },

  getBehaviorMap: function () {
    return {
      'modelOrderNumber': {
        getModels: function (behavior) {
          return behavior.owner.app.navSections;
        }
      },
      'customHandler': {
        afterCreate: this.afterCreate.bind(this)
      }
    };
  },

  afterCreate: function (behavior) {
    this.app.updateMinorVersion();
  }

});