"use strict";

Studio.AppDownload = function (app) {
  this.app = app;
  this.studio = app.studio;
};

$.extend(Studio.AppDownload.prototype, {
  constructor: Studio.AppDownload,

  download: function () {
    this.studio.toggleLoader(true);
    setTimeout(function () {
      this.execute().finally(function () {
        this.studio.toggleLoader(false);
      }.bind(this)).then(function (blob) {
        saveAs(blob, this.app.getName() +'.zip');
      }.bind(this), function (err) {
        console.error(err);
      }.bind(this));
    }.bind(this), 100);
  },

  execute: function () {
    const zip = new JSZip;
    const root = zip.folder(this.app.getName());
    this.saveMeta(root.folder('meta'));
    this.saveViews(root.folder('views'));
    this.savePrintViews(root.folder('export'));
    this.saveWorkflows(root.folder('workflows'));
    this.saveWorkflowViews(root.folder('wfviews'));
    this.saveNavSections(root.folder('navigation'));
    this.saveNavItemViews(root.folder('views'));
    this.saveTasks(root);
    this.saveInterfaces(root);
    this.savePackage(root);
    this.saveDeploy(root);
    this.saveLogo(root);
    this.saveVendors(root);
    this.saveJsonFile('studio.json', this.getStudioData(), root);

    return Promise.all([
      this.saveCommonInterfaceAssets(root)
    ]).then(function () {
      return zip.generateAsync({'type': 'blob'});
    });
  },

  saveMeta: function (root) {
    this.app.classes.forEach(function (model) {
      let data = this.getClassData(model);
      delete data.options;
      this.saveJsonFile(data.name +'.class.json', data, root);
    }, this);
  },

  saveViews: function (root) {
    this.app.classes.forEach(function (model) {
      var views = model.views.filter(function (item) {
        return !item.isEmpty();
      });
      if (views.length) {
        var folder = root.folder(model.data.name);
        views.forEach(function (view) {
          this.saveJsonFile(view.data.name +'.json', this.getClassViewData(view), folder);
        }, this);
      }
    }, this);
  },

  savePrintViews: function (root) {
    this.app.classes.forEach(function (model) {
      this.saveTypePrintViews('item', model, root);
      this.saveTypePrintViews('list', model, root);
    }, this);
  },

  saveTypePrintViews: function (type, cls, root) {
    var items = cls.getPrintViewsByType(type);
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      this.savePrintViewFile(item, i, root);
    }
  },

  savePrintViewFile: function (model, index, root) {
    try {
      var file = model.getFile();
      var dir = model.data.type + (index > 0 ? (index + 1) : '');
      var folder = root.folder(dir).folder(model.cls.app.getName());
      var fileName = model.cls.getName() +'.'+ model.data.extension;
      folder.file(fileName, Helper.File.getBlob(file.content));
    } catch (err) {
      console.error(err);
    }
  },

  saveWorkflows: function (root) {
    this.app.workflows.forEach(function (model) {
      let data = this.getWorkflowData(model);
      delete data.options;
      this.saveJsonFile(data.name +'.wf.json', data, root);
    }, this);
  },

  saveWorkflowViews: function (root) {
    this.app.workflows.forEach(function (wf) {
      var states = wf.states.filter(function (state) {
        return !state.isEmptyViews();
      });
      if (states.length) {
        var wfFolder = root.folder(wf.getNamespaceName());
        states.forEach(function (state) {
          var stateFolder = wfFolder.folder(state.getName());
          state.views.forEach(function (view) {
            this.saveJsonFile(view.cls.getNamespaceName() +'.json', this.getClassViewData(view), stateFolder);
          }, this);
        }, this);
      }
    }, this);
  },

  saveNavSections: function (root) {
    var items = this.app.navSections.map(function (model) {
      this.saveNavItems(model, root.folder(model.getName()));
      return this.getNavSectionData(model);
    }, this);
    items.forEach(function (data) {
      this.saveJsonFile(data.name +'.section.json', data, root);
    }, this);
  },

  saveNavItems: function (section, root) {
    var items = section.getNestedItems().map(function (model) {
      return this.getNavItemData(model);
    }, this);
    items.forEach(function (data) {
      this.saveJsonFile(data.code +'.json', data, root);
    }, this);
  },

  saveNavItemViews: function (root) {
    this.app.navSections.forEach(function (section) {
      section.getItems().forEach(function (item) {
        this.saveNavItemListView(item.getListView(), item, root);
      }, this);
    }, this);
  },

  saveNavItemListView: function (view, item, root) {
    if (view) {
      var folder = root.folder(item.getName()).folder(view.cls.getNamespaceName());
      this.saveJsonFile('list.json', this.getClassViewData(view), folder);
    }
  },

  saveTasks: function (root) {
    this.saveJsonFile('tasks.json', this.getTaskData(), root);
  },

  getTaskData: function () {
    return this.app.tasks.map(function (model) {
      let data = Object.assign({}, model.getData());
      model.normalizeExportData(data);
      return data;
    }, this);
  },

  // INTERFACE

  saveInterfaces: function (root) {
    if (this.app.interfaces.length) {
      this.app.interfaces.forEach(function (model) {
        this.saveInterface(model, root);
      }, this);
    }
  },

  saveInterface: function (model, root) {
    var data = model.getEditorData();
    if (data) {
      var name = model.getName();
      var navRoot = root.folder('portal').folder('navigation');
      this.saveJsonFile(name +'.node.json', this.getInterfaceNavNode(model), navRoot);
      root = root.folder('themes').folder('portal');
      var pageRoot = root.folder('templates').folder('interfaces');
      pageRoot.file(name +'.ejs', this.studio.renderSample('interface-html', {
        'title': model.getTitle(),
        'static': '/portal/'+ this.app.getName() +'/interfaces/'+ name +'/',
        'body': $.trim(data['gjs-html']),
        'vendorScripts': [
          'jquery/jquery.min'
        ].map(this.renderVendorAsset, this).join(''),
        'commonScripts': [
          'form',
          'list',
          'list-search',
          'tree-menu'
        ].map(this.renderCommonAsset, this).join('')
      }));
      var staticRoot = root.folder('static').folder('interfaces').folder(name);
      staticRoot.file('style.css', $.trim(data['gjs-css']));
    }
  },

  getInterfaceNavNode: function (model) {
    return {
      'code': model.getName(),
      'caption': model.getTitle(),
      'itemType': 'node'
    };
  },

  renderVendorAsset: function (name) {
    return '<script src="/portal/'+ this.app.getName() +'/vendor/'+ name +'.js"></script>';
  },

  renderCommonAsset: function (name) {
    return '<script src="/portal/'+ this.app.getName() +'/interface-common/'+ name +'.js"></script>';
  },

  saveCommonInterfaceAssets: function (root) {
    if (!this.app.interfaces.length) {
      return Promise.resolve();
    }
    return $.when(
      this.ajaxStaticAsset('form'),
      this.ajaxStaticAsset('list'),
      this.ajaxStaticAsset('list-search'),
      this.ajaxStaticAsset('tree-menu')
    ).then(function (...args){
      root = root.folder('themes').folder('portal').folder('static').folder('interface-common');
      root.file('form.js', args[0][0]);
      root.file('list.js', args[1][0]);
      root.file('list-search.js', args[2][0]);
      root.file('tree-menu.js', args[3][0]);
    });
  },

  ajaxStaticAsset: function (name) {
    return $.get(Helper.createStaticUrl('lib/interface-handler/'+ name +'.js'));
  },

  savePackage: function (root) {
    var data = this.app.package.exportData();
    this.saveJsonFile('package.json', data, root);
  },

  saveDeploy: function (root) {
    var data = (new Studio.AppDeploy(this.app)).create();
    this.saveJsonFile('deploy.json', data, root);
    this.saveDeployAuthModeService(root, data);
  },

  saveDeployAuthModeService: function (root, data) {
    data = Helper.Object.getNestedValue('modules.rest.globals.di', data, {});
    for (var key of Object.keys(data)) {
      var value = data[key] && data[key].module;
      if (value && value.indexOf('applications/') === 0) {
        try {
          root.folder('service').file(key +'.js', this.renderAuthServiceFile(key));
        } catch (err) {
          console.error(err);
        }
      }
    }
  },

  saveLogo: function (root) {
    var folder = root.folder('templates').folder('static');
    this.app.deploy.modules.forEach(function (module) {
      var file = Helper.File.get(module.data.logoFile);
      if (file) {
        folder.file('logo.png', Helper.File.getBlob(file.content));
      }
    }, this);
  },

  saveVendors: function (root) {
    var vendor = new Studio.AppVendor(this.app);
    root = root.folder('themes').folder('portal');
    this.saveJsonFile('bower.json', vendor.createBower(), root);
    this.saveJsonFile('.bowerrc', vendor.createBowerRc(), root);
  },

  saveJsonFile: function (name, data, folder) {
    folder.file(name, JSON.stringify(data, null, 2));
  },

  // CLASS

  getClassData: function (model) {
    let data = Object.assign({}, model.getData());
    data.properties = Helper.Array.mapMethod('exportData', model.attrs);
    model.normalizeExportData(data);
    return data;
  },

  // VIEW

  getClassViewData: function (view) {
    var data;
    switch (view.data.name) {
      case 'list':
        data = this.getClassListView(view);
        break;
      default:
        data = this.getClassItemView(view);
    }
    delete data.name;
    return data;
  },

  getClassListView: function (view) {
    return Object.assign({
      'columns': view.getAttrs().map(this.getViewAttrData, this)
    }, view.data);
  },

  getClassItemView: function (view) {
    view.setGroupChildren();
    return Object.assign({
      'tabs': this.getClassViewTabs(view)
    }, view.data);
  },

  getClassViewTabs: function (view) {
    var tabs = view.getTabs();
    return tabs.length
        ? tabs.map(this.getViewTabData, this)
        : this.getDefaultViewTabData(view);
  },

  getViewTabData: function (tab) {
    return {
      'caption': tab.data.caption,
      'fullFields': this.getViewItemsData(tab.children),
      'shortFields': []
    };
  },

  getDefaultViewTabData: function (view) {
    return [{
      'caption': '',
      'fullFields': this.getViewItemsData(view.getNotGroupedItems()),
      'shortFields': []
    }];
  },

  getViewItemsData: function (items) {
    return items.map(function (item) {
      return item instanceof Studio.ClassViewGroupModel
        ? this.getViewGroupData(item)
        : this.getViewAttrData(item);
    }, this);
  },

  getViewAttrData: function (attr) {
    var data = Object.assign({
      'property': attr.data.name,
    }, attr.data);
    data.type = parseInt(data.type);
    delete data.name;
    delete data.group;
    return data;
  },

  getViewGroupData: function (group) {
    var data = Object.assign({
      'caption': '',
      'type': 0,
      'fields': this.getViewItemsData(group.children)
    }, group.data);
    delete data.display;
    delete data.name;
    delete data.group;
    return data;
  },

  // WORKFLOW

  getWorkflowData: function (model) {
    let data = Object.assign({}, model.getData());
    data.states = Helper.Array.mapMethod('exportData', model.states);
    data.transitions = Helper.Array.mapMethod('exportData', model.transitions);
    model.normalizeExportData(data);
    data.states.forEach(function (data) {
      delete data.views;
    });
    return data;
  },

  // WORKFLOW VIEWS

  // NAV SECTION

  getNavSectionData: function (model) {
    let data = Object.assign({}, model.getData());
    return data;
  },

  // NAV ITEM

  getNavItemData: function (model) {
    let data = Object.assign({
      'code': model.getCode()
    }, model.getData());
    this.normalizeNavItemInterface(model, data);
    model.normalizeExportData(data);
    delete data.name;
    return data;
  },

  normalizeNavItemInterface: function (model, data) {
    var face = model.getInterface();
    delete data.interface;
    if (!model.getUrl() && face) {
      data.url = face.getUrl();
    }
  },

  // STUDIO DATA

  getStudioData: function () {
    return {
      'classes': this.getClassStudioData(this.app.classes.map(this.getClassData, this)),
      'workflows': this.getWorkflowStudioData(this.app.workflows.map(this.getWorkflowData, this)),
      'interfaces': this.app.interfaces.map(function (model) { return model.getData(); }),
      'changeLogs': this.app.changeLogs
    };
  },

  getClassStudioData: function (classes) {
    return this.indexItemOptionsByName(classes);
  },

  getWorkflowStudioData: function (workflows) {
    var result = {};
    workflows.forEach(function (data) {
      result[data.name] = {
        'states': this.indexItemOptionsByName(data.states),
        'transitions': this.indexItemOptionsByName(data.transitions)
      };
    }, this);
    return result;
  },

  indexItemOptionsByName: function (items) {
    var result = {};
    if (items instanceof Array) {
      items.forEach(function (data) {
        result[data.name] = data.options;
        delete data.options;
      });
    }
    return result;
  },

  renderAuthServiceFile: function (name) {
    return `const Service = require('modules/rest/lib/interfaces/Service');
/** Simple app service - REST module
 * @param {{dataRepo: DataRepository, metaRepo: MetaRepository}} options
 * @constructor
 */
function ${name}(options) {
  this._route = function(router) {
    this.addHandler(router, '/', 'POST', (req) => {
      return Promise.resolve({
        echo: 'peekaboo'
      });
    });
    this.addHandler(router, '/', 'GET', (req) => {
      return Promise.resolve({
        echo: 'peekaboo'
      });
    });
  };
}
${name}.prototype = new Service();
module.exports = ${name};`;
  }
});