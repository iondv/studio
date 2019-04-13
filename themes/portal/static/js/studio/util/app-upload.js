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
      for (var i = 0; i < this.files.length; ++i) {
        var file = this.files[i];
        JSZip.loadAsync(file).then(this.handleFile.bind(this, file), this.handleError.bind(this));
      }
    }.bind(this), 100);
  },

  handleError: function (err) {
    console.error(err);
  },

  handleFile: function (file, zip) {
    this.getZipData(zip).then(function (data) {
      this.data = data;
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

  // APP

  getApp: function (data) {
    var classMap = Helper.Object.getNestedValue('options.classes', data, {});
    var wfMap = Helper.Object.getNestedValue('options.workflows', data, {});
    var wfViewMap = Helper.Object.getNestedValue('wfviews', data, {});
    this.prepareWorkflowViews(wfViewMap, classMap);
    data.meta = this.filterEmpty(data.meta);
    data.workflows = this.filterEmpty(data.workflows);
    return {
      'name': data.package.name,
      'description': data.package.description,
      'version': data.package.version,
      'classes': data.meta.map(this.getClass.bind(this, classMap)),
      'workflows': data.workflows.map(this.getWorkflow.bind(this, wfMap, wfViewMap)),
      'navSections': this.getNavSections(data.navigation, data) || [],
      'tasks': data.tasks || [],
      'interfaces': Helper.Object.getNestedValue('options.interfaces', data, []),
      'changeLogs': Helper.Object.getNestedValue('options.changeLogs', data, []),
      'package': data.package || {}
    };
  },

  // CLASS

  getClass: function (options, data) {
    return $.extend(data, {
      'properties': data.properties || [],
      'views': this.getClassViews(this.getNestedValue('views.'+ data.name)),
      'options': $.extend({}, data.options, options[data.name])
    });
  },

  // VIEW

  getClassViews: function (data) {
    var views = [];
    data = data || {};
    for (var name in data) {
      if (data.hasOwnProperty(name) && data[name] && name.indexOf('@') === -1) {
        views.push(this.getClassView(name, data[name]));
      }
    }
    return views.length ? views : null;
  },

  getClassView: function (name, data) {
    switch (name) {
      case 'list': return this.getClassListView(name, data);
    }
    return this.getClassItemView(name, data)
  },

  getClassListView: function (name, data) {
    var result = Object.assign({}, data);
    result.name = name;
    result.properties = [];
    result.groups = [];
    if (data.columns && data.columns instanceof Array) {
      this.setClassViewItems(data.columns, null, result);
    }
    delete result.columns;
    return result;
  },

  getClassItemView: function (name, data) {
    var result = Object.assign({}, data);
    result.name = name;
    result.properties = [];
    result.groups = [];
    if (data.tabs && data.tabs instanceof Array) {
      this.isEmptyViewTabs(data.tabs)
        ? this.setClassViewItems(data.tabs[0].fullFields, null, result)
        : data.tabs.forEach(this.setClassViewTab.bind(this, result));
    }
    delete result.tabs;
    return result;
  },

  isEmptyViewTabs: function (tabs) {
    return !tabs.length || (tabs.length === 1 && (tabs[0].caption === '' || tabs[0].caption === undefined));
  },

  setClassViewTab: function (result, tab) {
    tab.display = 'tab';
    tab.name = Helper.generateId();
    result.groups.push(tab);
    this.setClassViewItems(tab.fullFields, tab, result);
    delete tab.fullFields;
    delete tab.shortFields;
  },

  setClassViewItems: function (items, group, result) {
    if (items instanceof Array) {
      for (var i = 0; i < items.length; ++i) {
        if (group) {
          items[i].group = group.name;
        }
        items[i].type === 0
          ? this.setClassViewGroup(items[i], result)
          : this.setClassViewAttr(items[i], result);
      }
    }
  },

  setClassViewGroup: function (data, result) {
    data.display = 'group';
    data.name = Helper.generateId();
    data.caption = $.trim(data.caption);
    result.groups.push(data);
    this.setClassViewItems(data.fields, data, result);
    delete data.fields;
  },

  setClassViewAttr: function (data, result) {
    data.name = data.property;
    delete data.property;
    result.properties.push(data);
  },

  // WORKFLOW

  getWorkflow: function (options, views, data) {
    $.extend(data, {
      'states': data.states,
      'transitions': data.transitions
    });
    options = options[data.name] || {};
    var stateOptions = options.states || {};
    views = views.hasOwnProperty(data.name) ? views[data.name] : {};
    data.states.forEach(this.assignWorkflowStateOptions.bind(this, stateOptions, views));
    var transitionOptions = options.transitions || {};
    data.transitions.forEach(this.assignWorkflowTransitionOptions.bind(this, transitionOptions));
    return data;
  },

  assignWorkflowStateOptions: function (options, views, data) {
    data.options = Object.assign({}, options[data.name]);
    views = views.hasOwnProperty(data.name) ? views[data.name] : {};
    data.views = views instanceof Array ? views : [];
  },

  assignWorkflowTransitionOptions: function (options, data) {
    data.options = Object.assign({}, options[data.name]);
  },

  prepareWorkflowViews: function (viewMap, classMap) {
    for (var wf in viewMap) {
      if (viewMap.hasOwnProperty(wf)) {
        viewMap[wf.split('@')[0]] = viewMap[wf];
        for (var state in viewMap[wf]) {
          if (viewMap[wf].hasOwnProperty(state)) {
            var map = viewMap[wf][state];
            var result = [];
            for (var cls in map) {
              if (map.hasOwnProperty(cls)) {
                result.push(this.getClassItemView(cls.split('@')[0], map[cls]));
              }
            }
            viewMap[wf][state] = result;
          }
        }
      }
    }
  },

  // NAV SECTION

  getNavSections: function (data) {
    if (!data) {
      return [];
    }
    var sections = [];
    for (var key in data) {
      if (data.hasOwnProperty(key) && key.indexOf('.section') > 0) {
        var section = data[key];
        section.items = this.getNavItems(data[section.name], '');
        sections.push(section);
      }
    }
    return sections;
  },

  // NAV ITEM

  getNavItems: function (data, prefix) {
    if (!data) {
      return [];
    }
    var items = [];
    for (var key in data) {
      if (data.hasOwnProperty(key) && (!prefix || key.indexOf(prefix) === 0)) {
        var name = key.substring(prefix.length);
        if (name.indexOf('.') === -1) {
          var item = data[key];
          item.name = name;
          item.items = this.getNavItems(data, item.code + '.');
          item.listView = this.getNavItemListView(item);
          delete item.code;
          items.push(item);
        }
      }
    }
    return items;
  },

  getNavItemListView: function (item) {
    var data = this.data.views || {};
    if (data.hasOwnProperty(item.name)) {
      data = data[item.name];
      data = data && data[item.classname +'@'+ this.data.name];
      return data && data.list
        ? this.getClassListView('list', data.list)
        : null;
    }
  },

  filterEmpty: function (data) {
    return data instanceof Array
      ? data.filter(function (data) {
        return !!data;
      })
      : [];
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