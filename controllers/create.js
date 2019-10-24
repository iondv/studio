'use strict';

const fs = require('fs');
const path = require('path');
const base = require('../backend/base');
const validator = require('../backend/validator');

module.exports = function (req, res, next) {
  try {
    let data = req.body;
    if (!data) {
      return res.status(400).send('Invalid data');
    }
    let root = base.resolvePath(data.path);
    let exists = true;
    if (base.isEmptyApp(root)) {
      return res.send({'data': createApp(root)});
    }
    res.send({
      'data': base.readJsonFile('package', root),
      'exists': true
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.toString());
  }
};

function createApp (root) {
  base.createDir(root);
  base.createDir(path.join(root, 'meta'));
  base.createDir(path.join(root, 'navigation'));
  base.createDir(path.join(root, 'views'));
  base.createDir(path.join(root, 'workflows'));
  base.createDir(path.join(root, 'wfviews'));
  let data = {
    'name': path.basename(root) || 'new-app',
    'description': '',
    'version': '0.0.0'
  };
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(data, null, 2));
  return data;
}

