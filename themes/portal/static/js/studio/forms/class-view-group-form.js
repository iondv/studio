"use strict";

Studio.ClassViewGroupForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.ClassViewGroupModel, studio);
};

$.extend(Studio.ClassViewGroupForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.ClassViewGroupForm,

  init: function () {
    Studio.ModelForm.prototype.init.call(this);
    this.getAttr('display').$value.change(function () {
      if (this.isTab()) {
        this.getAttr('group').clearValue();
      }
    }.bind(this));
  },

  isTab: function () {
    return this.getAttr('display').getValue() === 'tab';
  },

  create: function (view) {
    this.view = view;
    this.cls = view.cls;
    this.app = view.cls.app;
    Studio.ModelForm.prototype.create.call(this, {
      'group': this.getDefaultGroupId()
    });
  },

  update: function (model) {
    this.model = model;
    this.view = model.view;
    this.cls = this.view.cls;
    this.app = this.cls.app;
    Studio.ModelForm.prototype.update.apply(this, arguments);
  },

  hideParentGroupForTab: function () {
    this.attrMap['group'].toggle(!this.model.isTab());
  },

  getValidationRules: function () {
    return {
      caption: [
        ['required']
      ],
      group: [
        ['tabWithoutParent'],
        ['handler', {
          validate: this.validateLoopedGroups.bind(this)
        }]
      ],
      options: [
        ['json']
      ]
    };
  },

  validateLoopedGroups: function (parentId, validator) {
    if (this.model && this.model.isAncestorFor(parentId)) {
      validator.addError(Helper.L10n.translate('Parent group is a child of the current one'))
    }
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
    var attr = this.getAttr('group');
    var group = this.view.getDefaultGroup(this.model);
    if (group && !attr.getValue() && !this.isTab()) {
      attr.setValue(group.id);
    }
  }
});
