"use strict";

Studio.ClassViewAttrForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.ClassViewAttrModel, studio);
};

$.extend(Studio.ClassViewAttrForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.ClassViewAttrForm,

  create: function (view, classAttr, defaults) {
    this.view = view;
    this.cls = view.cls;
    this.app = view.cls.app;
    this.classAttr = classAttr;
    Studio.ModelForm.prototype.create.call(this, $.extend({
      'group': this.getDefaultGroupId()
    }, this.getClassAttrData(), defaults));
  },

  createHidden: function (view, classAttr, defaults) {
    this.view = view;
    this.cls = view.cls;
    this.app = view.cls.app;
    this.classAttr = classAttr;
    Studio.ModelForm.prototype.createHidden.call(this, $.extend({
      'group': this.getDefaultGroupId()
    }, this.getClassAttrData(), defaults));
  },

  getClassAttrData: function () {
    return this.classAttr ? {
      'name': this.classAttr.data.name,
      'caption': this.classAttr.data.caption,
      'type': this.classAttr.getViewType(),
      'orderNumber': this.classAttr.data.orderNumber
    } : null;
  },

  update: function (model) {
    this.model = model;
    this.view = model.view;
    this.cls = this.view.cls;
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
        //['existingClassAttr']
      ],
      caption: [
        ['required'],
        ['uniqueModel', {
          getModel: this.getUniqueModel
        }]
      ],
      type: [
        ['required']
      ]
    };
  },

  getUniqueModel: function (value, validator) {
    return validator.attr.form.view.getAttrByKeyValue(value, validator.attr.name);
  },

  getBehaviorMap: function () {
    return {
      'modelOrderNumber': {
        getModels: function (behavior) {
          return behavior.owner.view.getItems();
        }
      },
      'customHandler': {
        afterCreate: this.afterCreate.bind(this),
        afterUpdate: this.afterCreate.bind(this)
      }
    };
  },

  afterCreate: function (behavior) {
    var group = this.view.getDefaultGroup();
    var attr = this.getAttr('group');
    if (group && !attr.getValue()) {
      attr.setValue(group.id);
    }
  }
});