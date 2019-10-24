"use strict";

Studio.CodeEditorForm = function ($modal, studio) {
  Studio.Form.call(this, $modal, studio);
};

$.extend(Studio.CodeEditorForm.prototype, Studio.Form.prototype, {
  constructor: Studio.CodeEditorForm,

  init: function () {
    Studio.Form.prototype.init.call(this);
    this.$code = this.$modal.find('.code-editor-container');
    this.editor = ace.edit(this.$code.get(0));
    this.editor.$blockScrolling = Infinity;
    this.editor.setTheme('ace/theme/github');
    this.$save = this.$modal.find('.form-save');
    this.$save.click(this.onSave.bind(this));
  },

  show: function (value, mode, afterSave) {
    this.afterSave = afterSave;
    this.alert.hide();
    this.editor.session.setMode('ace/mode/'+ mode);
    this.editor.setValue(Helper.stringifyJson(value, 3));
    //this.editor.clearSelection();
    this.editor.selection.moveTo(0, 0);
    this.editor.focus();
    this.$modal.modal('show');
  },

  onAfterShow: function () {
    this.setFormHeight();
  },

  setFormHeight: function () {
    var modalH = this.$modal.find('.modal-content');
    var winH = $(window).height();
  },

  hasError: function () {
    return this.editor.session.getAnnotations().length > 0;
  },

  onSave: function () {
    if (this.hasError()) {
      return this.alert.danger(Helper.L10n.translate('Invalid code'));
    }
    this.$modal.modal('hide');
    this.afterSave(this.editor.getValue());
  }
});