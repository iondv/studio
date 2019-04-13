"use strict";

Studio.ListViewMaker = function ($container, studio) {
  this.$container = $container;
  this.studio = studio;
  this.$sourceContainer = this.$container.children('.studio-list-source');
  this.$sourceAttrList = this.$sourceContainer.find('.class-attr-list');
  this.$targetContainer = this.$container.children('.studio-list-target');
  this.$targetAttrList = this.$targetContainer.find('.table-view');
  this.droppable = new Studio.Droppable($container, studio);
};

$.extend(Studio.ListViewMaker.prototype, {

  initListeners: function () {
    var redraw = this.redraw.bind(this);
    this.studio.events.on('changeContentMode', this.onChangeContentMode.bind(this));
    this.studio.events.on('changeActiveItem', redraw);
    this.studio.events.on('removeNavSection', redraw);
    this.studio.events.on('createNavItem', redraw);
    this.studio.events.on('updateNavItem', redraw);
    this.studio.events.on('removeNavItem', redraw);
    this.studio.events.on('createClassViewAttr', redraw);
    this.studio.events.on('updateClassViewAttr', redraw);
    this.studio.events.on('removeClassViewAttr', redraw);
    this.studio.events.on('createNavItemListView', redraw);
    this.studio.events.on('removeNavItemListView', redraw);

    this.droppable.events.on('drop', this.onDrop.bind(this));

    this.$sourceAttrList.on('click', '.view-class-attr', this.onClickClassAttr.bind(this));
    this.$sourceAttrList.on('dblclick', '.view-class-attr', this.onDoubleClickClassAttr.bind(this));
    this.$targetAttrList.on('click', '.list-view-attr', this.onClickViewAttr.bind(this));
    this.$targetAttrList.on('dblclick', '.list-view-attr', this.onDoubleClickViewAttr.bind(this));
  },

  isActive: function () {
    return this.$container.is(':visible');
  },

  getActiveView: function () {
    return this.view;
  },

  getActiveViewAttr: function () {
    return this.view && this.view.getAttr(this.getActiveViewAttrId());
  },

  getActiveViewAttrId: function () {
    return this.$targetAttrList.find('.selected').data('id');
  },

  setActiveViewAttr: function (id) {
    this.$targetAttrList.find('[data-id="'+ id +'"]').addClass('selected');
  },

  clearSelected: function () {
    this.$targetAttrList.find('.selected').removeClass('selected');
    this.$sourceAttrList.find('.selected').removeClass('selected');
  },

  createViewAttr: function (classAttr) {
    this.studio.classViewAttrForm.createHidden(this.view, classAttr);
    return this.view.createAttr(this.studio.classViewAttrForm.getData());
  },

  // HANDLERS

  onChangeContentMode: function (event, mode) {
    this.$container.toggle(mode === 'listView');
    this.redraw();
  },

  onClickClassAttr: function (event) {
    var $item = $(event.currentTarget);
    this.clearSelected();
    if (this.view) {
      $item.addClass('selected');
    }
  },

  onDoubleClickClassAttr: function (event) {
    if (this.view) {
      var attr = this.view.cls.getAttr($(event.currentTarget).data('id'));
      this.studio.classViewAttrForm.create(this.view, attr);
    }
  },

  onClickViewAttr: function (event) {
    this.clearSelected();
    if (this.view) {
      $(event.currentTarget).addClass('selected');
    }
  },

  onDoubleClickViewAttr: function (event) {
    var attr = this.getActiveViewAttr();
    attr && this.studio.classViewAttrForm.update(attr);
  },

  // DRAW

  redraw: function () {
    if (this.isActive()) {
      this.navItem = this.studio.getActiveNavItem();
      this.navItemClass = this.navItem ? this.navItem.getClass() : null;
      this.classListView = this.navItemClass ? this.navItemClass.getListView() : null;
      this.view = this.navItem ? this.navItem.getListView() : null;
      this.draw();
    }
  },

  draw: function () {
    this.clear();
    this.renderSource();
    this.renderTarget();
  },

  clear: function () {
    this.$sourceAttrList.empty();
    this.$targetAttrList.empty();
  },

  renderTarget: function () {
    var content = '';
    var lastActiveAttrId = this.getActiveViewAttrId();
    var view = this.view || this.classListView;
    if (!view) {
      content = this.studio.renderAlertSample('warning', 'Select a navigation item with class to display view');
      return this.$targetAttrList.html(content);
    }
    var attrs = Studio.Model.sort(view.getAttrs());
    if (view === this.classListView) {
      content = this.studio.renderAlertSample('info', 'Create navigation view to replace class view');
      content += this.renderViewAttrs(attrs);
      return this.$targetAttrList.html(content);
    }
    if (view.isEmpty()) {
      content = this.studio.renderAlertSample('warning', 'Create list view attributes');
      return this.$targetAttrList.html(content);
    }
    this.$targetAttrList.html(this.renderViewAttrs(attrs));
    this.setActiveViewAttr(lastActiveAttrId);
  },

  renderSource: function () {
    var content = '';
    var view = this.view || this.classListView;
    var classAttrs = this.navItemClass ? this.navItemClass.getAttrs() : [];
    if (!this.navItemClass) {
      content = this.studio.renderAlertSample('warning', 'Select a navigation item with class to display attributes');
    } else if (!classAttrs.length) {
      content = this.studio.renderAlertSample('warning', 'No class attributes');
    } else if (!view) {
      content = Studio.Model.sort(classAttrs).map(this.renderClassAttr, this).join('');
    } else {
      var attrs = Studio.Model.sort(view.getUnusedClassAttrs());
      content = attrs.length
        ? attrs.map(this.renderClassAttr, this).join('')
        : this.studio.renderAlertSample('success', 'All class attributes are placed on the view');
    }
    this.$sourceAttrList.html(content);
  },

  renderClassAttr: function (attr) {
    return this.studio.renderSample('class-attr', {
      'id': attr.id,
      'title': attr.getTitle(),
      'cssClass': this.view ? 'droppable-touch' : ''
    });
  },

  renderViewAttrs: function (attrs) {
    var result = '';
    for (var i = 0; i < attrs.length; ++i) {
      result += this.renderViewAttr(attrs[i]);
    }
    return result;
  },

  renderViewAttr: function (attr) {
    return this.studio.renderSample('list-view-attr', {
      'id': attr.id,
      'name': attr.getName(),
      'title': attr.getTitle(),
      'type': attr.getTypeTitle(),
      'cssClass': this.view ? 'droppable-touch' : ''
    });
  },

  // DROP

  onDrop: function (event, data) {
    var id = data.$item.data('id');
    data.classAttr = this.view.cls.getAttr(id);
    data.viewItem = this.view.getItem(id);
    if (data.classAttr) {
      data.viewItem = this.dropClassAttr(data);
    }
    if (data.viewItem && this.dropViewItem(data)) {
      this.redraw(this.view.isTabItem(data.viewItem) ? data.viewItem.id : null);
      this.studio.triggerChangeModel(data.viewItem);
    }
  },

  dropClassAttr: function (data) {
    var target = this.getViewTarget(data.$target);
    if (target || this.inTargetArea(data.$target)) {
      return this.createViewAttr(data.classAttr);
    }
  },

  dropViewItem: function (data) {
    data.target = this.getViewTarget(data.$target);
    if (data.target === data.viewItem) {
      return false;
    }
    return this.dropViewAttr(data);
  },

  dropViewAttr: function (data) {
    if (data.target) {
      this.view.moveItemAfter(data.viewItem, data.target);
      return true;
    } else if (this.inTargetArea(data.$target)) {
      this.view.moveItemInto(data.viewItem, this.view.getDefaultGroup());
      return true;
    }
  },

  getViewTarget: function ($item) {
    return this.view.getAttr($item.closest('.list-view-attr').data('id'));
  },

  inTargetArea: function ($item) {
    return $item.closest('.studio-list-target').length > 0;
  }
});