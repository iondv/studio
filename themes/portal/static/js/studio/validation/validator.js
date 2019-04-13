"use strict";

Studio.Validator = function (attr, params) {
  this.attr = attr;
  this.params = $.extend({
    skipOnEmpty: true,
    skipOnError: true,
  }, params);
};

Studio.Validator.create = function (attr, data) {
  var Validator = null;
  switch (data[0]) {
    case 'handler': Validator = Studio.HandlerValidator; break;
    case 'identifier': Validator = Studio.IdentifierValidator; break;
    case 'mask': Validator = Studio.MaskValidator; break;
    case 'required': Validator = Studio.RequiredValidator; break;
    case 'json': Validator = Studio.JsonValidator; break;
    case 'existingClassAttr': Validator = Studio.ExistingClassAttrValidator; break;
    case 'tabWithoutParent': Validator = Studio.TabWithoutParentValidator; break;
    case 'unique': Validator = Studio.UniqueValidator; break;
    case 'uniqueModel': Validator = Studio.UniqueModelValidator; break;
  }
  if (!Validator) {
    throw new Error('Unknown validator: '+ data[0]);
  }
  return new Validator(attr, data[1]);
};

$.extend(Studio.Validator.prototype, {

  createMessage: function (message) {
    return Helper.L10n.translate(message);
  },

  execute: function () {
    var value = this.attr.getRawValue();
    if ((this.params.skipOnError && this.attr.hasError()) || (this.params.skipOnEmpty && this.isEmptyValue(value))) {
      return false;
    }
    this.validate(value);
  },

  isEmptyValue: function (value) {
    return value === undefined || value === null || value.length === 0;
  },

  addError: function (message) {
    this.attr.addError(message || this.getMessage());
  }
});

// HANDLER

Studio.HandlerValidator = function () {
  Studio.Validator.apply(this, arguments);
};

$.extend(Studio.HandlerValidator.prototype, Studio.Validator.prototype, {
  constructor: Studio.HandlerValidator,

  validate: function (value) {
    this.params.validate.call(this, value, this);
  }
});

// IDENTIFIER

Studio.IdentifierValidator = function (attr, params) {
  Studio.Validator.call(this, attr, $.extend({
    pattern: /^[a-zA-Z0-9-]+$/
  }, params));
};

$.extend(Studio.IdentifierValidator.prototype, Studio.Validator.prototype, {
  constructor: Studio.IdentifierValidator,

  getMessage () {
    return this.createMessage('Value must be an identifier');
  },

  validate: function (value) {
    if (!this.params.pattern.test(value)) {
      this.addError();
    }
  }
});

// IDENTIFIER

Studio.MaskValidator = function (attr, params) {
  Studio.Validator.call(this, attr, $.extend({
  }, params));
};

$.extend(Studio.MaskValidator.prototype, Studio.Validator.prototype, {
  constructor: Studio.MaskValidator,

  getMessage () {
    return this.createMessage('Invalid value');
  },

  validate: function (value) {
    if (!this.attr.$value.inputmask('isComplete')) {
      this.addError();
    }
  }
});

// REQUIRED

Studio.RequiredValidator = function () {
  Studio.Validator.apply(this, arguments);
  this.params.skipOnEmpty = false;
};

$.extend(Studio.RequiredValidator.prototype, Studio.Validator.prototype, {
  constructor: Studio.RequiredValidator,

  getMessage () {
    return this.createMessage('Value cannot be blank');
  },

  validate: function (value) {
    if (this.isEmptyValue(value)) {
      this.addError();
    }
  }
});

// JSON

Studio.JsonValidator = function () {
  Studio.Validator.apply(this, arguments);
};

$.extend(Studio.JsonValidator.prototype, Studio.Validator.prototype, {
  constructor: Studio.JsonValidator,

  getMessage () {
    return this.createMessage('Invalid JSON');
  },

  validate: function (value) {
    try {
      JSON.parse(this.attr.getRawValue());
    } catch (err) {
      this.addError();
    }
  }
});

// EXISTING CLASS ATTR

Studio.ExistingClassAttrValidator = function () {
  Studio.Validator.apply(this, arguments);
};

$.extend(Studio.ExistingClassAttrValidator.prototype, Studio.Validator.prototype, {
  constructor: Studio.ExistingClassAttrValidator,

  getMessage () {
    return this.createMessage('Attribute is not found in class');
  },

  validate: function (value) {
    let model = this.attr.form.cls.getAttrByKeyValue(value, this.attr.name);
    if (!model) {
      this.addError();
    }
  }
});

// TAB WITHOUT PARENT

Studio.TabWithoutParentValidator = function () {
  Studio.Validator.apply(this, arguments);
};

$.extend(Studio.TabWithoutParentValidator.prototype, Studio.Validator.prototype, {
  constructor: Studio.TabWithoutParentValidator,

  getMessage () {
    return this.createMessage('Tab can not have parent');
  },

  validate: function (value) {
    if (this.attr.form.isTab()) {
      this.addError();
    }
  }
});