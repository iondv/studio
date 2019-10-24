"use strict";

Studio.AppForm = function ($modal, studio) {
  Studio.ModelForm.call(this, $modal, Studio.AppModel, studio);
};

$.extend(Studio.AppForm.prototype, Studio.ModelForm.prototype, {
  constructor: Studio.AppForm,

  isServerSync: function () {
    return this.getServerSync().getValue();
  },

  getServerSync: function () {
    return this.getAttr('serverSync');
  },

  getData: function () {
    let data = Studio.ModelForm.prototype.getData.call(this);
    return this.isNew() && this.isServerSync()
      ? Object.assign(data, this.data)
      : data;
  },

  onCreate: function () {
    if (!this.validate()) {
      return this.jumpToError();
    }
    if (!this.isServerSync()) {
      return this.completeCreation();
    }
    this.studio.toggleLoader(true);
    let request = this.studio.standalone.createApp(this.getValue('path'));
    request.always(this.onAlwaysCreateApp.bind(this));
    request.done(this.onDoneCreateApp.bind(this));
    request.fail(this.onFailCreateApp.bind(this));
  },

  onAlwaysCreateApp: function (data) {
    this.studio.toggleLoader(false);
  },

  onDoneCreateApp: function (data) {
    this.exists = data.exists;
    data = data.data;
    this.data.name = data.name;
    this.data.description = data.description;
    this.completeCreation();
  },

  onFailCreateApp: function (error) {
    this.alert.danger(error);
  },

  completeCreation: function () {
    Studio.Behavior.execute('afterCreate', this);
    this.triggerCreate();
    this.hide();
  },

  getValidationRules: function () {
    return {
      path: [
        ['required', {when: function () {
            return this.isServerSync() && this.isNew();
        }.bind(this)}]
      ],
      name: [
        ['required', {when: function () {
            return !this.isNew() || !this.isServerSync();
        }.bind(this)}],
        ['identifier'],
        ['reservedName']
      ],
      version: [['mask']]
    };
  },

  getBehaviorMap: function () {
    return {
      'customHandler': {
        beforeCreate: this.beforeCreate.bind(this),
        beforeUpdate: this.beforeUpdate.bind(this),
        afterUpdate: this.afterUpdate.bind(this)
      }
    };
  },

  beforeCreate: function (behavior) {
    let active = this.studio.standalone.isActive();
    this.getServerSync().toggle(active);
    this.getServerSync().disable(!active);
    this.getAttr('path').disable(!active);
    this.getAttr('ionModulesDependencies').setValue(['ionadmin', 'registry']);
  },

  beforeUpdate: function (behavior) {
    let active = this.studio.standalone.isActive();
    this.getServerSync().toggle(active && this.isServerSync());
    this.getServerSync().disable(true);
    this.getAttr('path').disable(true);
  },

  afterUpdate: function (behavior) {
    if (this.isVersionChanged()) {
      this.model.setChangedState(true); // disable auto versioning after manual editing
    }
  },

  isVersionChanged: function () {
    return this.model && this.getValue('version') !== this.model.getVersion();
  },
});