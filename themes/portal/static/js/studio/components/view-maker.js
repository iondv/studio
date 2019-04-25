"use strict";

Studio.ViewMaker = function ($container, studio) {
  this.$container = $container;
  this.studio = studio;
  this.modeName = 'view';
  this.selectViewMessage = 'Select a view to display elements';
  this.$targetContainer = this.$container.children('.studio-view-target');
  this.$targetTabNav = this.$targetContainer.children('.nav-tabs');
  this.$targetTabContent = this.$targetContainer.children('.tab-content');
  this.$sourceContainer = this.$container.children('.studio-view-source');
  this.$sourceAttrList = this.$sourceContainer.find('.class-attr-list');
  this.droppable = new Studio.Droppable($container, studio);
};

$.extend(Studio.ViewMaker.prototype, {

  initListeners: function () {
    this.initStudioListeners();
    this.initMakerListeners();
  },

  initStudioListeners: function () {
    var redraw = this.redraw.bind(this);
    this.studio.events.on('changeContentMode', this.onChangeContentMode.bind(this));
    this.studio.events.on('changeActiveItem', redraw);

    this.studio.events.on('selectClassView', redraw);
    this.studio.events.on('createClassView', redraw);

    this.studio.events.on('createClassViewAttr', redraw);
    this.studio.events.on('updateClassViewAttr', redraw);
    this.studio.events.on('removeClassViewAttr', redraw);

    this.studio.events.on('createClassViewGroup', redraw);
    this.studio.events.on('updateClassViewGroup', redraw);
    this.studio.events.on('removeClassViewGroup', redraw);
  },

  initMakerListeners: function () {
    this.droppable.events.on('drag', this.onDrag.bind(this));
    this.droppable.events.on('drop', this.onDrop.bind(this));
    this.$sourceAttrList.on('mousedown', '.view-class-attr', this.onClickClassAttr.bind(this));
    // this.$sourceAttrList.on('dblclick', '.view-class-attr', this.onDoubleClickClassAttr.bind(this));
    this.$targetTabNav.on('mousedown', '.tab-nav-item', this.onClickTabNav.bind(this));
    this.$targetTabNav.on('dblclick', '.tab-nav-item', this.onDoubleClickViewGroup.bind(this));
    this.$targetTabContent.on('mousedown', '.view-attr', this.onClickViewAttr.bind(this));
    this.$targetTabContent.on('dblclick', '.view-attr', this.onDoubleClickViewAttr.bind(this));
    this.$targetTabContent.on('mousedown', '.view-group-head', this.onClickViewGroup.bind(this));
    this.$targetTabContent.on('dblclick', '.view-group-head', this.onDoubleClickViewGroup.bind(this));
  },

  isActive: function () {
    return this.$container.is(':visible');
  },

  getActiveClass: function () {
    return this.studio.getActiveClass();
  },

  getActiveView: function () {
    return this.studio.getActiveClassView();
  },

  getActiveViewItemId: function () {
    return this.$targetTabContent.find('.selected').data('id');
  },

  getActiveViewAttrId: function () {
    return this.$targetTabContent.find('.view-attr.selected').data('id');
  },

  getActiveViewGroupId: function () {
    return this.$targetTabContent.find('.view-group.selected').data('id')
      || this.$targetTabNav.find('.active').data('id');
  },

  getActiveViewTabId: function () {
    return this.$targetTabNav.find('.active').data('id');
  },

  getTargetTabNav: function (id) {
    return this.$targetTabNav.find('[data-id="'+ id +'"]');
  },

  getTargetTabPane: function (id) {
    return this.$targetTabContent.children('[data-id="'+ id +'"]');
  },

  setActiveTargetTab: function (id) {
    var $nav = this.getTargetTabNav(id);
    if (!$nav.length) {
      $nav = this.$targetTabNav.find('[data-id]').first();
    }
    $nav.addClass('active');
    this.getTargetTabPane($nav.data('id')).addClass('active');
  },

  setActiveViewItem: function (id) {
    this.$targetTabContent.find('[data-id="'+ id +'"]').addClass('selected');
  },

  clearSelectedTarget: function () {
    this.clearSelectedTabNav();
    this.clearSelectedTabContent();
  },

  clearSelectedTabNav: function () {
    this.$targetTabNav.find('.selected').removeClass('selected');
  },

  clearSelectedTabContent: function () {
    this.$targetTabContent.find('.selected').removeClass('selected');
  },

  appendAllClassAttrs: function () {
    var attrs = Studio.Model.sort(this.view.getUnusedClassAttrs());
    attrs.forEach(function (classAttr) {
      var attr = this.createViewAttr(classAttr);
    }, this);
    if (attrs.length) {
      this.redraw();
      this.studio.triggerChangeModel(this.view);
    }
  },

  createViewAttr: function (classAttr) {
    this.studio.classViewAttrForm.createHidden(this.view, classAttr);
    return this.view.createAttr(this.studio.classViewAttrForm.getData());
  },

  // HANDLERS

  onChangeContentMode: function (event, mode) {
    this.$container.toggle(mode === this.modeName);
    this.redraw();
  },

  onClickClassAttr: function (event) {
    var $item = $(event.currentTarget);
    $item.parent().find('.selected').removeClass('selected');
    if (this.view) {
      $item.addClass('selected');
    }
  },

  onDoubleClickClassAttr: function (event) {
    if (this.view) {
      var attr = this.view.cls.getAttr($(event.currentTarget).data('id'));
      this.studio.toolbar.onCreateClassViewAttr(event, attr);
    }
  },

  onClickViewAttr: function (event) {
    this.clearSelectedTarget();
    $(event.currentTarget).addClass('selected');
  },

  onDoubleClickViewAttr: function (event) {
    this.studio.toolbar.onUpdateClassViewAttr();
  },

  onClickViewGroup: function (event) {
    this.clearSelectedTarget();
    $(event.currentTarget).closest('.view-group').addClass('selected');
  },

  onDoubleClickViewGroup: function (event) {
    this.studio.toolbar.onUpdateClassViewGroup();
  },

  onClickTabNav: function (event) {
    event.preventDefault();
    var $nav = $(event.currentTarget);
    this.clearSelectedTarget();
    this.$targetTabNav.find('.active').removeClass('active');
    $nav.addClass('active selected');
    this.$targetTabContent.children('.active').removeClass('active');
    this.getTargetTabPane($nav.data('id')).addClass('active')
  },

  // DRAW

  redraw: function (activeViewTabId) {
    if (this.isActive()) {
      this.view = this.getActiveView();
      this.draw(activeViewTabId);
    }
  },

  draw: function (activeViewTabId) {
    var content = '';
    var lastActiveTabId = activeViewTabId || this.getActiveViewTabId();
    var lastActiveItemId = this.getActiveViewItemId();
    this.clear();
    this.renderSource();
    if (!this.view) {
      content = this.studio.renderAlertSample('warning', this.selectViewMessage);
      return this.$targetTabContent.html(content);
    }
    if (this.view.isEmpty()) {
      content = this.studio.renderAlertSample('info', 'Create attributes and groups');
      return this.$targetTabContent.html(content);
    }
    this.view.setGroupChildren();
    content = this.renderViewItems(this.view.getRootItems());
    this.$targetTabContent.html(content);
    this.setActiveTargetTab(lastActiveTabId);
    this.setActiveViewItem(lastActiveItemId);
  },

  clear: function () {
    this.$sourceAttrList.empty();
    this.$targetTabNav.empty();
    this.$targetTabContent.empty();
  },

  renderSource: function () {
    var content = '';
    var cls = this.getActiveClass();
    var classAttrs = cls ? cls.getAttrs() : [];
    if (!cls) {
      content = this.studio.renderAlertSample('warning', 'Select a class to display attributes');
    } else if (!classAttrs.length) {
      content = this.studio.renderAlertSample('warning', 'No class attributes');
    } else if (!this.view) {
      content = Studio.Model.sort(classAttrs).map(this.renderClassAttr, this).join('');
    } else {
      var attrs = Studio.Model.sort(this.view.getUnusedClassAttrs());
      content = attrs.length
        ? attrs.map(this.renderClassAttr, this).join('')
        : this.studio.renderAlertSample('success', 'All class attributes are placed on the view');
    }
    this.$sourceAttrList.html(content);
  },

  renderViewItems: function (items) {
    var result = '';
    for (var i = 0; i < items.length; ++i) {
      if (items[i] instanceof Studio.ClassViewAttrModel) {
        result += this.renderViewAttr(items[i]);
      } else if (items[i].isTab()) {
        result += this.renderViewTab(items[i]);
      } else {
        result += this.renderViewGroup(items[i]);
      }
    }
    return result;
  },

  renderViewAttr: function (attr) {
    var cssClass = attr.isRequired() ? 'required' : '';
    return this.studio.renderSample('view-attr', {
      'id': attr.id,
      'title': attr.getTitle(),
      'type': attr.getTypeTitle(),
      'cssClass': cssClass
    });
  },

  renderViewGroup: function (group) {
    var title = group.getTitle();
    return this.studio.renderSample('view-group', {
      'id': group.id,
      'title': title,
      'cssClass': title === '' ? 'has-empty-title' : '',
      'children': this.renderViewItems(group.children)
    });
  },

  renderViewTab: function (group) {
    this.$targetTabNav.append(this.studio.renderSample('view-tab-nav', {
      'id': group.id,
      'title': group.getTitle()
    }));
    return this.studio.renderSample('view-tab-pane', {
      'id': group.id,
      'children': this.renderViewItems(group.children)
    });
  },

  renderViewTabNav: function (group) {
    return this.studio.renderSample('view-tab-nav', {
      'id': group.id,
      'title': group.getTitle()
    });
  },

  renderClassAttr: function (attr) {
    return this.studio.renderSample('class-attr', {
      'id': attr.id,
      'title': attr.getTitle(),
      'cssClass': 'droppable-touch'
    });
  },

  clearDroppableTarget: function () {
    this.$targetTabContent.find('.target').removeClass('target');
  },

  // DRAG

  onDrag: function (event, data) {
    var $place = data.$target.closest('.droppable-place');
    var $item = $place.closest('.droppable-item');
    var id = data.$item.data('id');
    if (!$place.hasClass('target')) {
      this.clearDroppableTarget();
      if (!$item.closest('.dragged').length && !$item.closest('[data-id="'+ id +'"]').length) {
        $place.addClass('target');
      }
    }
  },

  onDrop: function (event, data) {
    var id = data.$item.data('id');
    data.pos = data.$target.closest('.droppable-place').data('pos');
    this.clearDroppableTarget();
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
    data.isGroupTarget = data.pos === 'inner' && data.target instanceof Studio.ClassViewGroupModel;
    if (data.target === data.viewItem) {
      return false;
    }
    if (this.view.isTabItem(data.viewItem)) {
      return this.dropViewTab(data);
    }
    if (this.view.isGroupItem(data.viewItem)) {
      return this.dropViewGroup(data);
    }
    return this.dropViewAttr(data);
  },

  dropViewTab: function (data) {
    if (data.target) {
      if (this.view.isTabItem(data.target)) {
        this.view.moveItemAfter(data.viewItem, data.target);
        return true;
      }
    } else if (this.inTargetNav(data.$target)) {
      this.view.moveItemAfter(data.viewItem);
      return true;
    }
  },

  dropViewGroup: function (data) {
    if (data.isGroupTarget) {
      this.view.moveItemInto(data.viewItem, data.target);
      return true;
    } else if (data.target) {
      data.pos === 'before'
        ? this.view.moveItemBefore(data.viewItem, data.target)
        : this.view.moveItemAfter(data.viewItem, data.target);
      return true;
    } else if (this.inTargetNav(data.$target)) {
      this.view.moveGroupToTab(data.viewItem);
      return true;
    }
  },

  dropViewAttr: function (data) {
    if (data.isGroupTarget) {
      this.view.moveItemInto(data.viewItem, data.target);
      return true;
    } else if (data.target) {
      data.pos === 'before'
        ? this.view.moveItemBefore(data.viewItem, data.target)
        : this.view.moveItemAfter(data.viewItem, data.target);
      return true;
    } else if (this.inTargetArea(data.$target)) {
      this.view.moveItemInto(data.viewItem, this.view.getDefaultGroup());
      return true;
    }
  },

  getViewTarget: function ($target) {
    return this.view.getAttr($target.closest('.view-attr').data('id'))
        || this.view.getGroup($target.closest('.view-group').data('id'))
        || this.view.getGroup($target.closest('.tab-nav-item').data('id'))
        || this.view.getGroup($target.closest('.tab-pane').data('id'));
  },

  inTargetArea: function ($target) {
    return $target.closest('.studio-view-target .tab-content').length > 0;
  },

  inTargetNav: function ($target) {
    return $target.closest('.studio-view-target .nav').length > 0;
  }
});