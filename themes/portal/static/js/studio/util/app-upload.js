"use strict";

Studio.AppUpload = function (files, studio) {
  this.files = files;
  this.studio = studio;
};

$.extend(Studio.AppUpload.prototype, {
  constructor: Studio.AppUpload,

  execute: function () {
    this.studio.toggleLoader(true);
    setTimeout(function () {
      var handleError = this.handleError.bind(this);
      for (var i = 0; i < this.files.length; ++i) {
        var file = this.files[i];
        JSZip.loadAsync(file).then(this.handleFile.bind(this, file), handleError);
      }
    }.bind(this), 100);
  },

  handleError: function (err) {
    console.error(err);
  },

  handleFile: function (file, zip) {
    this.getZipData(zip).then(function (data) {
      this.data = data;
      this.parser = new Studio.MetaParser(data);
      data = this.getApp(data);
      // data.name = Helper.getBaseName(file.name);
      this.studio.onUploadApp(data);
    }.bind(this));
  },

  getZipData: function (zip) {
    var data = {}, promises = [];
    var studioFile = 'studio.json';
    var taskFile = 'tasks.json';
    var packageFile = 'package.json';
    var deployFile = 'deploy.json';
    zip.forEach(function (path, entry) {
      if (entry.dir) {
        return false;
      }
      path = path.split('/');
      data.name = path[0];
      path = path.slice(1).join('/');
      var parse;
      if (this.isAnyPathStart(['meta', 'workflows'], path)) {
        parse = this.assignArrayValue.bind(this, path, data);
      } else if (this.isAnyPathStart([studioFile], path)) {
        parse = this.assignKeyData.bind(this, 'options', data);
      } else if (this.isAnyPathStart([packageFile], path)) {
        parse = this.assignKeyData.bind(this, 'package', data);
      } else if (this.isAnyPathStart([taskFile], path)) {
        parse = this.assignKeyData.bind(this, 'tasks', data);
      } else if (this.isAnyPathStart([deployFile], path)) {
        parse = this.assignKeyData.bind(this, 'deploy', data);
      } else if (this.isAnyPathStart(['views', 'navigation', 'wfviews'], path)) {
        parse = this.assignObjectValue.bind(this, path, data);
      }
      if (parse) {
        promises.push(entry.async('string').then(parse, this.handleError.bind(this)));
      }
    }.bind(this));
    return Promise.all(promises).then(function () {
      this.studio.toggleLoader(false);
      return Promise.resolve(data);
    }.bind(this));
  },

  isAnyPathStart: function (names, path) {
    for (var i = 0; i < names.length; ++i) {
      if (path.indexOf(names[i]) === 0) {
        return true;
      }
    }
  },

  assignKeyData (key, data, value) {
    data[key] = Helper.parseJson(value);
  },

  assignObjectValue: function (path, data, value) {
    value = this.parseJson(value, path);
    this.setNestedValue(value, path, data);
  },

  assignArrayValue: function (path, data, value) {
    value = this.parseJson(value, path);
    this.pushNestedValue(value, path, data);
  },

  getNestedValue: function (key) {
    return Helper.Object.getNestedValue(key, this.data);
  },

  pushNestedValue: function (value, key, data) {
    if (!data || typeof key !== 'string') {
      return false;
    }
    var parts = key.split('/');
    for (let i = 0; i < parts.length; ++i) {
      key = parts[i];
      if (i + 1 === parts.length) {
        data.push(value);
      } else {
        if (!data.hasOwnProperty(key)) {
          data[key] = i + 2 === parts.length ? [] : {};
        }
        data = data[key];
      }
    }
  },

  setNestedValue: function (value, key, data) {
    if (!data || typeof key !== 'string') {
      return false;
    }
    key = key.substring(0, key.indexOf('.json'));
    var parts = key.split('/');
    for (let i = 0; i < parts.length; ++i) {
      key = parts[i];
      if (i + 1 === parts.length) {
        data[key] = value;
      } else {
        if (!data.hasOwnProperty(key)) {
          data[key] = {};
        }
        data = data[key];
      }
    }
  },

  getApp: function (data) {
    var optionClassMap = Helper.Object.getNestedValue('options.classes', data, {});
    var viewMap = this.getNestedValue('views') || {};
    var optionWorkflowMap = Helper.Object.getNestedValue('options.workflows', data, {});
    var workflowViewMap = Helper.Object.getNestedValue('wfviews', data, {});
    this.parser.prepareWorkflowViews(workflowViewMap, optionClassMap);
    data.meta = this.parser.filterEmpty(data.meta);
    data.workflows = this.parser.filterEmpty(data.workflows);
    return {
      'name': data.package.name,
      'description': data.package.description,
      'version': data.package.version,
      'classes': data.meta.map(this.parser.getClass.bind(this.parser, optionClassMap, viewMap)),
      'workflows': data.workflows.map(this.parser.getWorkflow.bind(this.parser, optionWorkflowMap, workflowViewMap)),
      'navSections': this.parser.getNavSections(data.navigation, data) || [],
      'tasks': data.tasks || [],
      'interfaces': Helper.Object.getNestedValue('options.interfaces', data, []),
      'changeLogs': Helper.Object.getNestedValue('options.changeLogs', data, []),
      'deploy': data.deploy || {},
      'package': data.package || {}
    };
  },

  parseJson (data, name) {
    if (name.indexOf('.json') === -1) {
      return console.log('Skip path:', name);
    }
    try {
      return JSON.parse(data);
    } catch (err) {
      alert(Helper.L10n.translate('JSON parsing error: ') + name);
    }
  }
});