"use strict";

Studio.AppDeploy = function (app) {
  this.app = app;
  this.studio = app.studio;
};

$.extend(Studio.AppDeploy.prototype, {
  constructor: Studio.AppDeploy,

  create: function () {
    var ns = this.app.getName();
    return {
      'namespace': ns,
      'deployer': 'built-in',
      'modules': {
        'portal': {
          'import' : {
            'src': 'applications/'+ ns +'/portal',
            'namespace': ns
          },
          'globals': {
            'portalName': ns,
            'default': this.getDefaultPage(),
            'theme': ns + '/portal',
            'templates': ['applications/'+ ns +'/themes/portal/templates'],
            'statics': {[ns]: 'applications/'+ ns +'/themes/portal/static'},
            'pageTemplates': {
              'navigation': this.getNavigation()
            }
          }
        }
      }
    };
  },

  getDefaultPage: function () {
    return this.app.interfaces.length ? this.app.interfaces[0].getName() : 'index';
  },

  getNavigation: function () {
    var result = {};
    this.app.interfaces.forEach(function (model) {
      result[model.getName()] = 'interfaces/'+ model.getName();
    });
    return result;
  }
});
