"use strict";

Studio.CodeEditorForm = function ($modal, studio) {
  Studio.Form.call(this, $modal, studio);
};

$.extend(Studio.CodeEditorForm.prototype, Studio.Form.prototype, {
  constructor: Studio.CodeEditorForm,

  init: function () {
    Studio.Form.prototype.init.call(this);
    this.alert = new Studio.Alert(this.$modal.find('.form-alert'));
    this.$code = this.$modal.find('.code-editor-container');
    this.editor = ace.edit(this.$code.get(0));
    this.editor.$blockScrolling = Infinity;
    this.editor.setTheme('ace/theme/github');
    this.$save = this.$modal.find('.form-save');
    this.$save.click(this.onSave.bind(this));
  },

  show: function (value, attr, mode) {
    this.attr = attr;
    this.editor.session.setMode('ace/mode/'+ mode);
    this.editor.setValue(Helper.stringifyJson(value, 3));
    //this.editor.clearSelection();
    this.editor.selection.moveTo(0, 0);
    this.editor.focus();
    this.alert.hide();
    this.$modal.modal('show');
  },

  hasError: function () {
    return this.editor.session.getAnnotations().length > 0;
  },

  onSave: function () {
    if (this.hasError()) {
      return this.alert.danger(Helper.L10n.translate('Invalid code'));
    }
    this.attr.setValue(this.editor.getValue());
    this.$modal.modal('hide');
  },
});