'use strict';

const fs = require('fs');
const path = require('path');
const deploy = require('../deploy.json');
const baseRoot = path.join(__dirname, '../../../', (deploy.globals.appRoot || ''));
const jsonExt = '.json';
const jsonSpace = 2;

module.exports = {
  isEmptyApp,
  resolvePath,
  getPath,
  readJsonFile,
  mapJsonFiles,
  updateJsonFile,
  removeJsonFile,
  createDir,
  removeDir,
  emptyDir,
  renameFile,
  renameByHandler,
  renameListByHandler
};

function isEmptyApp (root) {
  return !fs.existsSync(path.join(root, 'package.json'));
}

function resolvePath (root) {
  if (typeof root === 'string') {
    return path.isAbsolute(root) ? root : getPath(root);
  }
}

function getPath (dir) {
  return path.isAbsolute(dir) ? dir : path.join(baseRoot, dir);
}

function readJsonFile (name, root) {
  let file = path.join(root, name + jsonExt);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function mapJsonFiles (dir, includes) {
  let result = {};
  try {
    let files = fs.readdirSync(dir);
    for (let name of files) {
      if (!includes || includes.includes(name)) {
        let file = path.join(dir, name);
        let stat = fs.statSync(file);
        if (stat.isDirectory()) {
          result[name] = mapJsonFiles(file);
        } else if (path.extname(name).toLowerCase() === jsonExt) {
          result[path.basename(name, jsonExt)] = fs.readFileSync(file, 'utf8');
          // stat.mtime
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
  return result;
}

function updateJsonFile (name, root, data) {
  let file = path.join(root, name + jsonExt);
  let source = {};
  if (fs.existsSync(file)) {
    source = JSON.parse(fs.readFileSync(file, 'utf8'));
  } else {
    createDir(path.dirname(file));
  }
  fs.writeFileSync(file, JSON.stringify(Object.assign(source, data), null, jsonSpace));
}

function removeJsonFile (name, root) {
  return removeFile(path.join(root, name + jsonExt));
}

function createDir (dir) {
  return fs.mkdirSync(dir, {'recursive': true});
}

function removeDir (file) {
  let stat = null;
  try {
    stat = fs.statSync(file);
  } catch (err) {
    return false; // skip non-existent
  }
  if (stat.isFile()) {
    return fs.unlinkSync(file);
  }
  for (let item of fs.readdirSync(file)) {
    removeDir(path.join(file, item));
  }
  fs.rmdirSync(file);
}

function emptyDir (file) {
  let stat = null;
  try {
    stat = fs.statSync(file);
  } catch (err) {
    return false; // skip non-existent
  }
  if (stat.isDirectory()) {
    for (let item of fs.readdirSync(file)) {
      removeDir(path.join(file, item));
    }
  }
}

function removeFile (file) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

function renameListByHandler (files, root, renamer) {
  for (let file of files) {
    renameByHandler(path.join(root, file), renamer);
  }
}

function renameByHandler (root, renamer) {
  for (let item of fs.readdirSync(root)) {
    let stat = fs.statSync(path.join(root, item));
    let newItem = renamer(item, stat);
    if (newItem) {
      fs.renameSync(path.join(root, item), path.join(root, newItem));
      item = newItem;
    }
    if (stat.isDirectory()) {
      renameByHandler(path.join(root, item), renamer);
    }
  }
}

function renameFile (source, target) {
  if (fs.existsSync(source)) {
    fs.renameSync(source, target);
  }
}