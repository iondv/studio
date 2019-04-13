"use strict";

Studio.AppVendor = function (app) {
  this.app = app;
  this.studio = app.studio;
};

$.extend(Studio.AppVendor.prototype, {
  constructor: Studio.AppVendor,

  createBower: function () {
    var ns = this.app.getName();
    return {
      'name': ns,
      'version': this.app.getVersion(),
      'authors': [],
      'moduleType': [
        'node'
      ],
      'license': 'MIT',
      'ignore': [
        '**/.*',
        'node_modules',
        'bower_components',
        'src',
        'test',
        'tests'
      ],
      'dependencies': {
        'jquery': '~2',
        'jquery-ui': '*',
        'jquery.inputmask': '~4',
        'store-js': '~1.3.20'
      }
    };
  },

  createBowerRc: function () {
    return {
      'directory': './vendor',
      'vendorDir': './static/vendor',
      'strict-ssl': false,
      'registry': 'https://registry.bower.io'
    };
  },
});