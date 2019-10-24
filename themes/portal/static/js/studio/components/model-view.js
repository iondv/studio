"use strict";

Studio.ModelView = function (mode, form, $container, studio) {
  this.$container = $container;
  this.studio = studio;
  this.menu = studio.menu;
  this.mode = mode;
  this.form = form;
  this.$form = this.$container.children('.form');
};

$.extend(Studio.ModelView.prototype, {

  initListeners: function () {
    this.studio.events.on('changeContentMode', this.onChangeContentMode.bind(this));
  },

  isActive: function () {
    return this.$container.is(':visible');
  },

  getForm: function () {
    return this.form;
  },

  // HANDLER

  onChangeContentMode: function (event, mode) {
    this.$container.toggle(mode === this.mode);
    this.redraw();
  },

  // DRAW

  redraw: function () {
    if (this.isActive()) {
      this.app = this.studio.getActiveApp();
      this.draw();
    }
  },

  draw: function () {
    this.model = this.getModel();
    this.$form.html(this.renderForm());
  },

  renderForm: function () {
    let result = '';
    this.getForm().updateHidden(this.model);
    for (let attr of this.getForm().attrs) {
      result += this.renderAttr(attr);
    }
    return result;
  },

  renderAttr: function (attr) {
    var params = null;
    var name = attr.name;
    var value = attr.getValue(name);
    var $attr = attr.$attr;
    switch (attr.getType()) {
      case 'checkbox':
        params = this.getCheckboxAttrParams($attr, value, attr);
        break;
      case 'json':
      case 'deployRestAuthMode':
        params = this.getJsonAttrParams($attr, value, attr);
        break;
      case 'file':
        params = this.getFileAttrParams($attr, value, attr);
        break;
      default:
        params = this.getDefaultAttrParams($attr, value, attr);
    }
    params.name = name;
    if (params.content === undefined || params.content === '') {
      params.content = '<span class="not-set">[no data]</span>';
    }
    return this.studio.renderSample('modelViewAttr', params);
  },

  getCheckboxAttrParams: function ($attr, value) {
    return {
      'label': $attr.find('label .l10n').html(),
      'content': Helper.L10n.translate(value ? 'Yes' : 'No')
    };
  },

  getJsonAttrParams: function ($attr, value) {
    value = typeof value !== 'string'
      ? JSON.stringify(value, null, 4)
      : value;
    return {
      'label': this.getDefaultAttrLabel($attr),
      'content': '<pre>'+ value +'</pre>'
    };
  },

  getFileAttrParams: function ($attr, value, attr) {
    if (value) {
      var file = Helper.File.get(value);
      value = attr.image ? '<img src="'+ file.content +'" alt="">' : value;
    }
    return {
      'label': this.getDefaultAttrLabel($attr),
      'content': value
    };
  },

  getDefaultAttrParams: function ($attr, value) {
    return {
      'label': this.getDefaultAttrLabel($attr),
      'content': value
    };
  },

  getDefaultAttrLabel: function ($attr) {
    return $attr.find('.control-label').html();
  }
});