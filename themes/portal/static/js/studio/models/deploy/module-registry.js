"use strict";

Studio.DeployModuleRegistryModel = function (deploy, name, data) {
  Studio.DeployModuleModel.apply(this, arguments);
  this.printViewKey = 'globals.di.export.options.configs';
  this.setDefaults();
};

$.extend(Studio.DeployModuleRegistryModel.prototype, Studio.DeployModuleModel.prototype, {
  constructor: Studio.DeployModuleRegistryModel,

  setDefaults: function () {
    if (Helper.Object.getNestedValue('globals.di', this.data)) {
      return;
    }
    let app = this.app.getName();
    Helper.Object.setNestedValue('globals.di', this.data, {
      "itemToExcel": {
        "module": "modules/registry/export/itemToExcel",
        "initMethod": "init",
        "initLevel": 0,
        "options": {
          "tplDir": `applications/${app}/export/item`,
          "injectors": []
        }
      },
      "itemToDocx": {
        "module": "modules/registry/export/itemToDocx",
        "initMethod": "init",
        "initLevel": 0,
        "options": {
          "tplDir": `applications/${app}/export/item`,
          "injectors": []
        }
      },
      "listToDocx": {
        "module": "modules/registry/export/listToDocx",
        "initMethod": "init",
        "initLevel": 0,
        "options": {
          "tplDir": `applications/${app}/export/list`,
          "log": "ion://sysLog"
        }
      },
      "listToExcel": {
        "module": "modules/registry/export/listToExcel",
        "initMethod": "init",
        "initLevel": 0,
        "options": {
          "tplDir": `applications/${app}/export/list`,
          "log": "ion://sysLog"
        }
      },
      "export": {
        "options": {
          "configs": {}
        }
      }
    });
  },

  exportData: function () {
    this.syncData();
    return Studio.DeployModuleModel.prototype.exportData.apply(this, arguments);
  },

  syncData: function () {
    Helper.Object.setNestedValue(this.printViewKey, this.data, this.getPrintViews());
  },

  getPrintViews: function () {
    var source = Helper.Object.getNestedValue(this.printViewKey, this.data);
    var result = {};
    for (var cls of this.app.classes) {
      if (cls.printViews.length) {
        var data = {};
        for (var view of cls.printViews) {
          data[view.getName()] = this.getPrintViewData(view, source);
        }
        result[cls.getName()] = data;
      }
    }
    return result;
  },

  getPrintViewData: function (view, source) {
    var data = Object.assign({}, view.getData());
    data.preprocessor = view.getPreprocessor();
    data.fileNameTemplate = view.getTitle();

    source = Helper.Object.getNestedValue(view.cls.getName() + '.' + view.getName(), source, {});
    data.eagerLoading = data.eagerLoading || source.eagerLoading || [];

    delete data.name;
    delete data.file;
    return data;
  },

  setData: function (data) {
    this.removeOldFiles(data);
    return Studio.DeployModuleModel.prototype.setData.apply(this, arguments);
  },

  remove: function () {
    this.removeOldFiles({});
    return Studio.DeployModuleModel.prototype.remove.apply(this, arguments);
  },

  removeOldFiles: function (data) {
    if (this.data.logoFile && this.data.logoFile !== data.logoFile) {
      Helper.File.remove(this.data.logoFile);
    }
  }
});