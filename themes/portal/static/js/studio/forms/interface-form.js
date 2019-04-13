"use strict";

Studio.InterfaceForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.InterfaceModel, studio);
};

$.extend(Studio.InterfaceForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.InterfaceForm,

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
    return validator.attr.form.app.getInterfaceByKeyValue(value, validator.attr.name);
  },
});