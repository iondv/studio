"use strict";

Studio.TaskForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.TaskModel, studio);
};

$.extend(Studio.TaskForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.TaskForm,

  create: function (app, defaults) {
    this.app = app;
    Studio.ModelForm.prototype.create.call(this, defaults);
  },

  update: function (model) {
    this.app = model.app;
    this.task = model;
    Studio.ModelForm.prototype.update.apply(this, arguments);
  },

  getValidationRules: function () {
    return {
      code: [
        ['required'],
        ['identifier'],
        ['uniqueModel', {
          getModel: this.getUniqueModel
        }]
      ],
      title: [
        ['required'],
        ['uniqueModel', {
          getModel: this.getUniqueModel
        }]
      ]
    };
  },

  getUniqueModel: function (value, validator) {
    return validator.attr.form.app.getTaskByKeyValue(value, validator.attr.name);
  },
});