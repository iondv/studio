"use strict";

Studio.MetaParser = function (data) {
  this.data = data;
};

$.extend(Studio.MetaParser.prototype, {

  getClass: function (optionClassMap, viewMap, classData) {
    return Object.assign(classData, {
      'properties': classData.properties || [],
      'views': this.getClassViews(viewMap[classData.name]),
      'options': $.extend({}, classData.options, optionClassMap[classData.name])
    });
  },

  getClassViews: function (data) {
    data = data || {};
    var views = [];
    for (var name of Object.keys(data)) {
      if (data[name] && name.indexOf('@') === -1) {
        views.push(this.getClassView(name, data[name]));
      }
    }
    return views.length ? views : null;
  },

  getClassView: function (name, data) {
    switch (name) {
      case 'list':
        return this.getClassListView(name, data);
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
      data = data && data[item.classname + '@' + this.data.name];
      return data && data.list
          ? this.getClassListView('list', data.list)
          : null;
    }
  },

  // WORKFLOW

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

  getWorkflow: function (optionWorkflowMap, workflowViewMap, data) {
    Object.assign(data, {
      'states': data.states,
      'transitions': data.transitions
    });
    optionWorkflowMap = optionWorkflowMap[data.name] || {};
    let stateOptions = optionWorkflowMap.states || {};
    workflowViewMap = workflowViewMap.hasOwnProperty(data.name) ? workflowViewMap[data.name] : {};
    data.states.forEach(this.assignWorkflowStateOptions.bind(this, stateOptions, workflowViewMap));
    let transitionOptions = optionWorkflowMap.transitions || {};
    data.transitions.forEach(this.assignWorkflowTransitionOptions.bind(this, transitionOptions));
    return data;
  },

  assignWorkflowStateOptions: function (stateOptions, workflowViewMap, data) {
    data.options = Object.assign({}, stateOptions[data.name]);
    workflowViewMap = workflowViewMap.hasOwnProperty(data.name) ? workflowViewMap[data.name] : {};
    data.views = workflowViewMap instanceof Array ? workflowViewMap : [];
  },

  assignWorkflowTransitionOptions: function (transitionOptions, data) {
    data.options = Object.assign({}, transitionOptions[data.name]);
  },

  filterEmpty: function (data) {
    return data instanceof Array
      ? data.filter(function (data) {
        return !!data;
      })
      : [];
  },

  // PRINT VIEW

  getPrintViews: function (cls) {
    return {
      item: this.getPrintViewsByType('item', cls),
      list: this.getPrintViewsByType('list', cls)
    };
  },

  getPrintViewsByType: function (type, cls) {
    var items = cls.getPrintViewsByType(type);
  }
});