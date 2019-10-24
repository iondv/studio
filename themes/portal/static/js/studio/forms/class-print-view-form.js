"use strict";

Studio.ClassPrintViewForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.ClassPrintViewModel, studio);
};

$.extend(Studio.ClassPrintViewForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.ClassPrintViewForm,

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

  getData: function () {
    var data = Studio.ModelForm.prototype.getData.call(this);
    var file = this.getAttr('file');
    if (file.file) {
      data.extension = file.getExtension();
      data.mimeType = file.getMimeType();
    }
    return data;
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
      file: [
        ['required']
      ]
    };
  },

  getUniqueModel: function (value, validator) {
    return validator.attr.form.cls.getPrintViewByKeyValue(value, validator.attr.name);
  },

  getUniqueNameModel: function (value) {
    var type = this.getAttr('type').getValue();
    value = value.toLowerCase();
    return type ? this.cls.getPrintViewByHandler(function (model) {
      return model.data.type === type && model.data.name.toLowerCase() === value;
    }) : null;
  },

  getUniqueCaptionModel: function (value) {
    var type = this.getAttr('type').getValue();
    value = value.toLowerCase();
    return type ? this.cls.getPrintViewByHandler(function (model) {
      return model.data.type === type && model.data.caption.toLowerCase() === value;
    }) : null;
  },

  getBehaviorMap: function () {
    return {
      'clearFileStore': {}
    };
  }
});