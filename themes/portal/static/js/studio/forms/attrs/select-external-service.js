"use strict";

Studio.SelectExternalServiceFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.SelectExternalServiceFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.SelectExternalServiceFormAttr,

  init: function () {
    this.studio = this.form.studio;
    this.services = Studio.ExternalServiceModel.restore(this.studio);
    this.createSelect();
    this.setValue(this.form.getRecentAddress());

    this.$actions = this.$attr.find('.ref-select-actions');
    this.getAction('create').click(this.onClickCreate.bind(this));
    this.getAction('update').click(this.onClickUpdate.bind(this));
    this.getAction('remove').click(this.onClickRemove.bind(this));

    this.studio.externalServiceForm.events.on('create', this.onCreate.bind(this));
    this.studio.externalServiceForm.events.on('update', this.onUpdate.bind(this));
  },

  getService: function (address) {
    return this.services[Helper.Array.searchByNestedValue(address, 'data.address', this.services)];
  },

  createSelect: function () {
    this.$value.html(Helper.Html.createSelectItems({
      'items': Helper.Array.mapMethod('getSelectData', this.services)
    }));
  },

  getAction: function (id) {
    return this.$actions.find('[data-id="'+ id +'"]');
  },

  onClickCreate: function () {
    this.studio.externalServiceForm.models = this.services;
    this.studio.externalServiceForm.create();
  },

  onClickUpdate: function () {
    var model = this.getService(this.getValue());
    if (model) {
      this.studio.externalServiceForm.models = this.services;
      this.studio.externalServiceForm.update(model);
    }
  },

  onClickRemove: function () {
    var model = this.getService(this.getValue());
    if (model && Helper.confirm(this.getAction('remove'))) {
      Helper.Array.removeValue(model, this.services);
      this.store();
      this.createSelect();
    }
  },

  onCreate: function (event, data) {
    var model = new Studio.ExternalServiceModel(this.studio, data);
    this.services.push(model);
    this.store();
    this.createSelect();
    this.setValue(model.getAddress());
  },

  onUpdate: function (event, model) {
    this.store();
    this.createSelect();
    this.setValue(model.getAddress());
  },

  store: function () {
    Studio.ExternalServiceModel.store(this.services);
  }

});