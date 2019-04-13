"use strict";

Studio.ExternalServiceModel = function (studio, data) {
  Studio.Model.call(this, 'externalService:', studio, data);
};

Studio.ExternalServiceModel.STORE_ID = 'Studio.ExternalServiceModel';

Studio.ExternalServiceModel.restore = function (studio) {
  var items = store.get(Studio.ExternalServiceModel.STORE_ID);
  return items instanceof Array ? items.map(function (data) {
      return new Studio.ExternalServiceModel(studio, data);
    }) : [];
};

Studio.ExternalServiceModel.store = function (models) {
  var data = Helper.Array.mapMethod('exportData', models);
  store.set(Studio.ExternalServiceModel.STORE_ID, data);
};

$.extend(Studio.ExternalServiceModel.prototype, Studio.Model.prototype, {
  constructor: Studio.ExternalServiceModel,

  getAddress: function () {
    return this.data.address;
  },

  getSelectData: function () {
    return {
      'value': this.getAddress(),
      'title': this.getAddress(),
      'text': this.getTitle()
    };
  },
});