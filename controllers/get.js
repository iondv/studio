'use strict';

const base = require('../backend/base');
const validator = require('../backend/validator');

module.exports = function (req, res, next) {
  try {
    let data = req.body;
    if (!data) {
      return res.status(400).send('Invalid data');
    }
    let root = base.resolvePath(data.path);
    if (base.isEmptyApp(root)) {
      return res.status(400).send('Not found application');
    }
    let result = null;
    switch (data.type) {
      default: result = getApp(root);
    }
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.toString());
  }
};

function getApp (root) {
  return base.mapJsonFiles(root, [
    'meta',
    'navigation',
    'views',
    'wfviews',
    'workflows',
    'deploy.json',
    'package.json',
    'studio.json',
    'tasks.json'
  ]);
}