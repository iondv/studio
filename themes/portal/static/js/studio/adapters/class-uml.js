"use strict";

Studio.ClassUmlAdapter = function ($container, studio) {
  this.studio = studio;
  this.menu = studio.menu;
  this.$container = $container;
  this.uml = new Uml($container);
};

$.extend(Studio.ClassUmlAdapter.prototype, {

  initListeners: function () {
    this.studio.events.on('changeContentMode', this.onChangeContentMode.bind(this));
    this.studio.events.on('createApp', this.onCreateApp.bind(this));
    this.studio.events.on('createClass', this.onCreateClass.bind(this));
    this.studio.events.on('updateClass', this.onUpdateClass.bind(this));
    this.studio.events.on('removeClass', this.onRemoveClass.bind(this));
    this.studio.events.on('createClassAttr', this.onCreateClassAttr.bind(this));
    this.studio.events.on('updateClassAttr', this.onUpdateClassAttr.bind(this));
    this.studio.events.on('removeClassAttr', this.onRemoveClassAttr.bind(this));
    this.studio.events.on('changeActiveItem', this.onChangeActiveItem.bind(this));
    this.uml.events.on('clickPage', this.onClickPage.bind(this));
    this.uml.events.on('clickRect', this.onClickRect.bind(this));
    this.uml.events.on('clickRectAttr', this.onClickRectAttr.bind(this));
    this.uml.events.on('doubleClickPage', this.onDoubleClickPage.bind(this));
    this.uml.events.on('doubleClickRect', this.onDoubleClickRect.bind(this));
    this.uml.events.on('doubleClickRectAttr', this.onDoubleClickRectAttr.bind(this));
    this.uml.draggable.events.on('end', this.onDragEnd.bind(this));
  },

  onChangeContentMode: function (event, mode) {
    this.$container.toggle(mode === 'class');
  },

  onCreateApp: function (event, model) {
    this.createPages(model);
  },

  onCreateClass: function (event, model) {
    var page = this.getClassPage(model.app);
    var rect = page.createRect(this.getRectData(model));
    page.addLinks(this.getClassLinks(model));
    page.updateLinksByNode(rect);
  },

  onUpdateClass: function (event, model) {
    var page = this.getClassPage(model.app);
    var rect = page.getRect(model.id);
    rect.update(this.getRectData(model));
    page.removeLinksByNode(rect, 'isSource');
    page.addLinks(this.getClassLinks(model));
    page.updateLinksByNode(rect);
  },

  onRemoveClass: function (event, model) {
    var page = this.getClassPage(model.app);
    page.getRect(model.id).remove();
  },

  onCreateClassAttr: function (event, model) {
    var page = this.getClassPage(model.cls.app);
    var rect = page.getRect(model.cls.id);
    var rectAttr = rect.createAttr(this.getRectAttrData(model));
    page.addLinks(this.getClassAttrLinks(model));
    page.updateLinksByNode(rectAttr);
  },

  onUpdateClassAttr: function (event, model) {
    var page = this.getClassPage(model.cls.app);
    var rect = page.getRect(model.cls.id);
    var rectAttr = rect.getAttr(model.id);
    rectAttr.update(this.getRectAttrData(model));
    page.removeLinksByNode(rectAttr);
    page.addLinks(this.getClassAttrLinks(model));
    page.updateLinksByNode(rectAttr);
  },

  onRemoveClassAttr: function (event, model) {
    var page = this.getClassPage(model.cls.app);
    var rect = page.getRect(model.cls.id);
    rect.getAttr(model.id).remove();
  },

  onChangeActiveItem: function (event) {
    var app = this.studio.getActiveApp();
    if (!app) {
      return this.uml.deactivatePages();
    }
    var page = this.getClassPage(app);
    page.activate();
    var cls = this.studio.getActiveClass();
    if (!cls) {
      return page.deactivateRects();
    }
    var rect = page.getRect(cls.id);
    if (!rect.isActive()) {
      page.deactivateRects();
      rect.activate();
    }
    var attr = this.studio.getActiveClassAttr();
    if (!attr) {
      return rect.deactivateAttrs();
    }
    attr = rect.getAttr(attr.id);
    if (!attr.isActive()) {
      rect.deactivateAttrs();
      attr.activate();
    }
  },

  onClickPage: function (event, data) {
    var rect = data.umlTarget.getActiveItem();
    if (rect) {
      rect.deactivate();
    }
  },

  onClickRect: function (event, data) {
    this.studio.menu.activate(this.menu.getItem(data.umlTarget.id));
  },

  onClickRectAttr: function (event, data) {
    this.menu.activate(this.menu.getItem(data.umlTarget.id));
  },

  onDoubleClickPage: function (event, data) {
    switch (this.getPageType(data.umlTarget)) {
      case 'class': this.showClassCreateForm(data); break;
    }
  },

  onDoubleClickRect: function (event, data) {
    this.menu.updateByItem(this.menu.getItem(data.umlTarget.id));
  },

  onDoubleClickRectAttr: function (event, data) {
    this.menu.updateByItem(this.menu.getItem(data.umlTarget.id));
  },

  onDragEnd: function (event, data) {
    var model = this.studio.getActiveClass();
    model.setUmlPosition(data.position);
    this.studio.triggerChangeModel(model);
  },

  restore: function () {
    this.studio.apps.forEach(function (app) {
      this.createPages(app);
    }, this);
  },

  // PAGES

  getClassPage: function (app) {
    return this.getPage('class', app);
  },

  getPage: function (type, app) {
    return this.uml.getPage(this.getPageId(type, app));
  },

  getPageId: function (type, app) {
    return app.id +'-'+ type;
  },

  getPageType: function (page) {
    return page.id.substring(page.id.lastIndexOf('-') + 1);
  },

  createPages: function (app) {
    this.createClassPage(app);
  },

  createClassPage: function (app) {
    this.uml.createPage({
      'id': this.getPageId('class', app),
      'title': app.getTitle(),
      'rects': this.getRects(app),
      'links': this.getLinks(app)
    });
  },

  // RECTS

  getRects: function (app) {
    return app.classes.map(this.getRectData.bind(this));
  },

  getRectData: function (cls) {
    return {
      'id': cls.id,
      'title': cls.getTitle(),
      'attrs': this.getRectAttrs(cls),
      'offset': cls.getOptionData('uml.offset')
    };
  },

  getRectAttrs: function (cls) {
    return cls.attrs.map(this.getRectAttrData.bind(this));
  },

  getRectAttrData: function (attr) {
    return {
      'id': attr.id,
      'title': attr.getTitle()
    };
  },

  // LINKS

  getLinks: function (app) {
    var links = [];
    app.classes.forEach(function (model) {
      links = links.concat(this.getClassLinks(model));
    }, this);
    return links;
  },

  getClassLinks: function (model) {
    var links = [];
    Helper.Array.pushNotEmpty(links, this.getClassParentLink(model));
    model.attrs.forEach(function (attr) {
      links = links.concat(this.getClassAttrLinks(attr));
    }, this);
    return links;
  },

  getClassParentLink: function (cls) {
    var parent = cls.getParent();
    if (parent) {
      return {
        'type': 'parent',
        'source': cls.id,
        'target': parent.id
      };
    }
  },

  getClassAttrLinks: function (attr) {
    var links = [];
    var refClass = this.getClassAttrRef('refClass', attr);
    var itemsClass = this.getClassAttrCollection('itemsClass', attr);
    Helper.Array.pushNotEmpty(links, refClass, itemsClass);
    return links;
  },

  getClassAttrRef: function (prop, attr) {
    let target = attr.getRefClass(prop);
    if (target) {
      return {
        'type': 'ref',
        'class': attr.cls.id,
        'source': attr.id,
        'target': target.id
      };
    }
  },

  getClassAttrCollection: function (prop, attr) {
    let target = attr.getRefClass(prop);
    if (target) {
      return {
        'type': 'collection',
        'class': attr.cls.id,
        'source': attr.id,
        'target': target.id
      };
    }
  },

  getAlignmentData: function (type, app) {
    var page = this.getPage(type, app);
    return {
      page: {
        'width': page.$page.width(),
        'height': page.$page.height()
      },
      items: page.rects.map(function (rect) {
        return {
          'rect': rect,
          'width': rect.$rect.width(),
          'height': rect.$rect.height()
        };
      })
    };
  },

  setAlignmentData: function (items, type, app) {
    items.forEach(function (item) {
      item.rect.setPosition(item);
      app.getClass(item.rect.id).setUmlPosition(item.rect.getPosition());
    });
    var page = this.getPage(type, app);
    page.updateLinks();
    this.studio.triggerChangeModel(app);
  },

  showClassCreateForm: function (data) {
    this.studio.classForm.create(this.studio.getActiveApp(), {
      options: {
        uml: {
          offset: {
            'left': data.offsetX,
            'top': data.offsetY
          }
        }
      }
    });
  }
});
