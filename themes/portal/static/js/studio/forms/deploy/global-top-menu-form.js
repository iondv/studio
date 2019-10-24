"use strict";

Studio.DeployGlobalTopMenuForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.DeployGlobalTopMenuModel, studio);
};

$.extend(Studio.DeployGlobalTopMenuForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.DeployGlobalTopMenuForm,

  init: function () {
    Studio.ModelForm.prototype.init.call(this);
    this.attrMap.section.$value.on('select2:select', this.onSelectSection.bind(this));
    this.attrMap.section.$value.on('select2:unselect', this.onUnselectSection.bind(this));
    this.attrMap.item.$value.on('select2:select', this.onSelectItem.bind(this));
    this.attrMap.item.$value.on('select2:unselect', this.onUnselectItem.bind(this));
  },

  isSystem: function () {
    return this.attrMap.system.getValue();
  },

  create: function (app, defaults) {
    this.app = app;
    this.global = this.app.deploy.global;
    Studio.ModelForm.prototype.create.call(this, defaults);
  },

  update: function (model) {
    this.app = model.app;
    this.global = this.app.deploy.global;
    Studio.ModelForm.prototype.update.apply(this, arguments);
    this.attrMap.item.prepare();
    this.attrMap.item.setValue(model.getData('item'));
  },

  onSelectSection: function () {
    var section = this.getSection();
    if (section) {
      this.attrMap.id.setValue(section.getName());
      this.attrMap.item.setValue('');
      this.attrMap.item.prepare();
      this.attrMap.url.setValue('');
      this.attrMap.caption.setValue(section.getTitle());
    }
  },

  onUnselectSection: function () {
    this.attrMap.id.setValue('');
    this.attrMap.item.setValue('');
    this.attrMap.item.prepare('');
    this.attrMap.url.setValue('');
    this.attrMap.caption.setValue('');
  },

  onSelectItem: function () {
    var item = this.getItem();
    if (item) {
      this.attrMap.url.setValue(this.getItemUrl(item));
    }
  },

  onUnselectItem: function () {
    this.attrMap.url.setValue('');
  },

  getSection: function () {
    return this.app.getNavSection(this.attrMap.section.getValue());
  },

  getSectionUrl: function (section) {
    return '/registry/'+ section.app.getName() +'@'+ section.getName();
  },

  getItems: function () {
    var section = this.getSection();
    return section ? section.getItems() : [];
  },

  getItem: function () {
    var section = this.getSection();
    return section ? section.getItem(this.attrMap.item.getValue()) : null;
  },

  getItemUrl: function (item) {
    return '/registry/'+ item.app.getName() +'@'+ item.getCode();
  },

  getSelectItems: function (attr) {
    switch (attr) {
      case 'name': return this.getNameSelectItems();
    }
  },

  getNameSelectItems: function () {
    return this.app.deploy.getModuleNames().map(function (name) {
      return {
        text: name,
        value: name
      };
    });
  },

  getValidationRules: function () {
    return {
      name: [
        ['required', {
          when: function () {
            return this.isSystem();
          }.bind(this)
        }]
      ],
      url: [
        ['required', {
          when: function () {
            return !this.isSystem();
          }.bind(this)
        }]
      ]
    };
  }
});