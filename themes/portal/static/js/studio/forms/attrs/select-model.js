"use strict";

Studio.SelectModelFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.SelectModelFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.SelectModelFormAttr,

  prepare: function () {
    Studio.FormAttr.prototype.prepare.call(this);
    this.$value.html(this.createItems());
    Helper.select2(this.$value);
  },

  createItems: function () {
    return Helper.Html.createSelectItems({
      'items': Helper.Array.mapMethod('getSelectData', this.getModels())
    });
  }
});

// SELECT CLASS

Studio.SelectClassFormAttr = function () {
  Studio.SelectModelFormAttr.apply(this, arguments);
};

$.extend(Studio.SelectClassFormAttr.prototype, Studio.SelectModelFormAttr.prototype, {
  constructor: Studio.SelectClassFormAttr,

  getModels: function () {
    return this.form.app.classes.filter(function (model) {
      return !this.form.cls || !this.selfExcept || this.form.cls.id !== model.id;
    }, this);
  }
});

// SELECT CLASS ATTR

Studio.SelectClassAttrFormAttr = function () {
  Studio.SelectModelFormAttr.apply(this, arguments);
};

$.extend(Studio.SelectClassAttrFormAttr.prototype, Studio.SelectModelFormAttr.prototype, {
  constructor: Studio.SelectClassAttrFormAttr,

  getModels: function () {
    return this.form.cls ? this.form.cls.getOwnAttrs() : [];
  }
});

// SELECT GROUP

Studio.SelectGroupFormAttr = function () {
  Studio.SelectModelFormAttr.apply(this, arguments);
};

$.extend(Studio.SelectGroupFormAttr.prototype, Studio.SelectModelFormAttr.prototype, {
  constructor: Studio.SelectGroupFormAttr,

  getModels: function () {
    return this.form.view.groups.filter(function (model) {
      return this.form.isNew() || this.form.model.id !== model.id;
    }, this);
  }
});

// SELECT NAV SECTION

Studio.SelectNavSectionFormAttr = function () {
  Studio.SelectModelFormAttr.apply(this, arguments);
};

$.extend(Studio.SelectNavSectionFormAttr.prototype, Studio.SelectModelFormAttr.prototype, {
  constructor: Studio.SelectNavSectionFormAttr,

  getModels: function () {
    return this.form.app.navSections;
  }
});

// SELECT NAV ITEM

Studio.SelectNavItemFormAttr = function () {
  Studio.SelectModelFormAttr.apply(this, arguments);
};

$.extend(Studio.SelectNavItemFormAttr.prototype, Studio.SelectModelFormAttr.prototype, {
  constructor: Studio.SelectNavItemFormAttr,

  getModels: function () {
    return this.form.getItems();
  }
});

// SELECT INTERFACE

Studio.SelectInterfaceFormAttr = function () {
  Studio.SelectModelFormAttr.apply(this, arguments);
};

$.extend(Studio.SelectInterfaceFormAttr.prototype, Studio.SelectModelFormAttr.prototype, {
  constructor: Studio.SelectInterfaceFormAttr,

  getModels: function () {
    return this.form.app.interfaces;
  }
});

// SELECT WORKFLOW

Studio.SelectWorkflowFormAttr = function () {
  Studio.SelectModelFormAttr.apply(this, arguments);
};

$.extend(Studio.SelectWorkflowFormAttr.prototype, Studio.SelectModelFormAttr.prototype, {
  constructor: Studio.SelectWorkflowFormAttr,

  getModels: function () {
    return  this.form.app.workflows;
  }
});

// SELECT WORKFLOW STATE

Studio.SelectWorkflowStateFormAttr = function () {
  Studio.SelectModelFormAttr.apply(this, arguments);
};

$.extend(Studio.SelectWorkflowStateFormAttr.prototype, Studio.SelectModelFormAttr.prototype, {
  constructor: Studio.SelectWorkflowStateFormAttr,

  getModels: function () {
    return  this.form.workflow ? this.form.workflow.states : [];
  }
});


