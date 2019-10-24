'use strict';

const base = require('../backend/base');

module.exports = {
  checkPath,
  checkIdName
};

function checkPath (root, res) {
  let result = true;
  try {
    if (root) {
      base.createDir(root);
    } else {
      result = 'Invalid path';
    }
  } catch (err) {
    result = err.toString();
  }
  return process(result, res);
}

function checkIdName (name, res) {
  let result = /^[a-zA-Z0-9-_]+$/.test(name) ? true : 'Invalid ID name';
  return process(result, res);
}

function process (result, res) {
  if (result === true) {
    return true;
  }
  res.status(400).send(result);
}