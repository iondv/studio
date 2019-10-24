"use strict";

Studio.Store = function (id, studio) {
  this.id = id;
  this.studio = studio;
};

$.extend(Studio.Store.prototype, {

  initListeners: function () {
    this.studio.events.on('changeModel', this.save.bind(this));
  },

  save: function () {
    let data = this.getData();
    store.set(this.id, data);
    this.lastTime = Date.now();
  },

  getData: function () {
    return this.studio.apps.map(function (app) {
      return this.getAppData(app);
    }.bind(this));
  },

  getAppData: function (app) {
    if (!app.isServerSync()) {
      return app.exportData();
    }
    return {
      'serverSync': true,
      'path': app.getPath(),
      'name': app.getName(),
      'description': app.getDescription()
    };
  },

  load: function () {
    this.setData(store.get(this.id));
    this.studio.menu.rebuild();
  },

  setData: function (data) {
    this.studio.clearAll();
    if (data instanceof Array) {
      data.forEach(this.setAppData, this);
    }
  },

  setAppData: function (data) {
    this.studio.createApp(data);
  }
});
