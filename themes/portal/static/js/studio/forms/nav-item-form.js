"use strict";

Studio.NavItemForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.NavItemModel, studio);
};

$.extend(Studio.NavItemForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.NavItemForm,

  create: function (parent, defaults) {
    this.app = parent.app;
    this.parent = parent;
    Studio.ModelForm.prototype.create.call(this, defaults);
  },

  update: function (model) {
    this.app = model.app;
    this.parent = model.parent;
    this.model = model;
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
      ],
      type: [
        ['handler', {
          validate: this.validateType.bind(this)
        }]
      ]
    };
  },

  validateType: function (value, validator) {
    if (this.model && this.model.items.length && parseInt(value) !== 0) {
      validator.addError(Helper.L10n.translate('Item with children should be a group'))
    }
  },

  getUniqueModel: function (value, validator) {
    return validator.attr.form.parent.getItemByKeyValue(value, validator.attr.name);
  },

  getBehaviorMap: function () {
    return {
      'modelOrderNumber': {
        getModels: function (behavior) {
          return behavior.owner.parent.getItems();
        }
      },
      'customHandler': {
        afterCreate: this.afterCreate.bind(this),
        afterUpdate: this.afterUpdate.bind(this)
      }
    };
  },

  afterCreate: function (behavior) {
    this.app.updateMinorVersion();
  },

  afterUpdate: function (behavior) {
    this.model.ensureListView(this.getValue('classname'));
  }
});