'use strict';

Studio.FormExtension = function (form) {
  this.form = form;
  this.studio = form.studio;
  this.elements = [];
  this.form.events.on('beforeShow', this.init.bind(this));
  this.form.events.on('change', this.update.bind(this));
};

$.extend(Studio.FormExtension.prototype, {

  init: function () {
    this.elements = [];
    for (var attr of this.form.attrs) {
      var data = attr.$attr.data('extension');
      if (data) {
        this.elements.push(new Studio.FormExtensionElement(data, attr, this));
      }
    }
    this.update();
  },

  update () {
    for (let element of this.elements) {
      element.update();
    }
  }
});

// ELEMENT

Studio.FormExtensionElement = function (data, attr, extension) {
  this.attr = attr;
  this.data = data;
  this.extension = extension;
  this.createActions();
};

$.extend(Studio.FormExtensionElement.prototype, {

  createActions: function () {
    this.actions = {};
    for (let id of Object.keys(this.data)) {
      let action = this.createAction(id, this.data[id]);
      if (action) {
        this.actions[id] = action;
      }
    }
  },

  createAction: function (id, data) {
    switch (id) {
      case 'enabled': return new Studio.FormExtensionEnabled(this, data);
      case 'visibility': return new Studio.FormExtensionVisibility(this, data);
    }
    console.error('Invalid extension action:', id);
  },

  update: function () {
    for (let id of Object.keys(this.actions)) {
      this.actions[id].update();
    }
  }
});

// BASE ACTION

Studio.FormExtensionBaseAction = function (element, data) {
  this.element = element;
  this.data = data;
  this.condition = new Studio.FormCondition(data, element.extension.form);
};

$.extend(Studio.FormExtensionBaseAction.prototype, {

  isValid: function () {
    return this.condition.isValid();
  },

  update: function () {
    this.isValid() ? this.setValid() : this.setInvalid();
  },

  setValid: function () {
  },

  setInvalid: function () {
  }
});

// ENABLED

Studio.FormExtensionEnabled = function () {
  Studio.FormExtensionBaseAction.apply(this, arguments);
};

$.extend(Studio.FormExtensionEnabled.prototype, Studio.FormExtensionBaseAction.prototype, {
  constructor: Studio.FormExtensionEnabled,

  setValid: function () {
    this.element.attr.disable(false);
  },

  setInvalid: function () {
    this.element.attr.disable(true);
  }
});

// VISIBILITY

Studio.FormExtensionVisibility = function (element, data) {
  Studio.FormExtensionBaseAction.apply(this, arguments);
};

$.extend(Studio.FormExtensionVisibility.prototype, Studio.FormExtensionBaseAction.prototype, {
  constructor: Studio.FormExtensionVisibility,

  setValid: function () {
    this.element.attr.$attr.removeClass('hidden');
  },

  setInvalid: function () {
    this.element.attr.$attr.addClass('hidden');
  }
});