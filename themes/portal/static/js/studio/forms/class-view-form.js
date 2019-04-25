"use strict";

Studio.ClassViewForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.ClassViewModel, studio);
};

$.extend(Studio.ClassViewForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.ClassViewForm,

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
        ['identifier']
      ]
    };
  },

  getUniqueModel: function (value, validator) {
    return validator.attr.form.cls.getViewByKeyValue(value, validator.attr.name);
  },

  getBehaviorMap: function () {
    return {
      'customHandler': {
        beforeCreate: this.beforeCreate.bind(this)
      }
    };
  },

  beforeCreate: function () {
  }
});

// NAV ITEM LIST VIEW

Studio.NavItemListViewForm = function ($modal, studio) {
  Studio.ClassViewForm.call(this, $modal, Studio.ClassViewModel, studio);
};

$.extend(Studio.NavItemListViewForm.prototype, Studio.ClassViewForm.prototype, {
  constructor: Studio.NavItemListViewForm,

  create: function (navItem) {
    this.navItem = navItem;
    this.cls = navItem.getClass();
    this.app = this.cls.app;
    Studio.ModelForm.prototype.create.call(this, {'name': 'list'});
  },
});
