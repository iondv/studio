"use strict";

Studio.FileFormAttr = function () {
  Studio.FormAttr.apply(this, arguments);
};

$.extend(Studio.FileFormAttr.prototype, Studio.FormAttr.prototype, {
  constructor: Studio.FileFormAttr,

  init: function () {
    this.$file = this.$attr.find('[type="file"]');
    this.$link = this.$attr.find('.file-download-link');

    this.$file.change(this.onChangeFile.bind(this));
    this.$value.change(this.onChangeValue.bind(this));
    this.$link.click(this.onClickLink.bind(this));
  },

  prepare: function () {
    Studio.FormAttr.prototype.prepare.call(this);
    this.fileId = Helper.generateId();
  },

  onChangeValue: function () {
    this.drawLink();
  },

  onClickLink: function () {
    var file = Helper.File.get(this.getValue());
    if (file) {
      var blob = Helper.File.getBlob(file.content);
      blob && saveAs(blob, file.name);
    }
  },

  onChangeFile: function (event) {
    this.clearError();
    this.file = this.$file.get(0).files[0];
    if (this.file) {
      Helper.File.getDataUrl(this.file, this.setFileContent.bind(this, this.file));
    }
  },

  setFileContent: function (file, err, content) {
    if (this.file !== file) {
      return false;
    }
    if (err) {
      this.addError(Helper.L10n.translate('Upload error'));
      return console.error(err);
    }
    try {
      Helper.File.store(this.fileId, file.name, file.size, content);
      this.setValue(this.fileId);
    } catch (err) {
      this.addError(Helper.L10n.translate('Local storage limit exceeded'));
      console.error(err);
    }
  },

  drawLink: function () {
    var content = '';
    var file = Helper.File.get(this.getValue());
    if (file) {
      content = this.form.studio.renderSample('file-download-link', {
        'name': file.name,
        'size': Helper.File.formatSize(file.size)
      });
    }
    this.$link.html(content);
  }
});