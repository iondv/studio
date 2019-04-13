"use strict";

Studio.ClassAttrForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.ClassAttrModel, studio);
};

$.extend(Studio.ClassAttrForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.ClassAttrForm,

  createClassId: function (cls) {
    this.cls = cls;
    this.app = this.cls.app;
    this.model = null;
    this.reset();
    this.prepareAttrs();
    this.setData({
      name: 'guid',
      caption: Helper.L10n.translate('ID'),
      type: 12,
      size: 24,
      readonly: true,
      indexed: true,
      unique: true,
      autoassigned: true
    });
    Studio.Behavior.execute('beforeCreate', this);
    Studio.Behavior.execute('afterCreate', this);
    this.triggerCreate();
  },

  create: function (cls) {
    this.cls = cls;
    this.app = this.cls.app;
    Studio.ModelForm.prototype.create.call(this);
  },

  update: function (model) {
    this.model = model;
    this.cls = model.cls;
    this.app = this.cls.app;
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
        ['required']
      ],
      defaultValue: [
        ['json']
      ],
      selConditions: [
        ['json']
      ],
      selSorting: [
        ['json']
      ],
      selectionProvider: [
        ['json']
      ],
      formula: [
        ['json']
      ]
    };
  },

  getUniqueModel: function (value, validator) {
    return validator.attr.form.cls.getOwnAttrByKeyValue(value, validator.attr.name);
  },

  getBehaviorMap: function () {
    return {
      'modelOrderNumber': {
        getModels: function (behavior) {
          return behavior.owner.cls.getOwnAttrs();
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
    if (this.isAttrChanged('name')) {
      this.app.updatePatchVersion();
    }
  }
});
