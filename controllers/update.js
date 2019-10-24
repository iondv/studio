'use strict';

const path = require('path');
const base = require('../backend/base');
const validator = require('../backend/validator');

module.exports = function (req, res, next) {
  try {
    let items = req.body && req.body.items;
    if (!(items instanceof Array)) {
      return res.status(400).send('Invalid data');
    }
    for (let item of items) {
      process(item);
    }
    res.send({});
  } catch (err) {
    console.error(err);
    res.status(500).send(err.toString());
  }
};

function process (item) {
  let root = base.getPath(item.path);
  if (base.isEmptyApp(root)) {
    throw new Error(`Invalid application path: ${root}`);
  }
  switch (item.action) {
    case 'update':
      return update(item, root);
    case 'remove':
      return remove(item, root);
    default:
      throw new Error(`Invalid action: ${item.action}`);
  }
}

// UPDATE

function update (item, root) {
  let {id, data} = item;
  switch (item.type) {
    case 'app':
      return updateApp(root, data);
    case 'class':
      return updateClass(root, id, data);
    case 'view':
      return updateView(root, id, data);
    case 'navSection':
      return updateNavSection(root, id, data);
    case 'navItem':
      return updateNavItem(root, id, data);
    case 'navItemListView':
      return updateNavItemListView(root, id, data);
    case 'workflow':
      return updateWorkflow(root, id, data);
    case 'workflowView':
      return updateWorkflowView(root, id, data);
    case 'studio':
      return updateStudio(root, data);
    case 'tasks':
      return updateTasks(root, data);
    default:
      throw new Error(`Invalid type: ${item.type}`);
  }
}

function updateApp (root, data) {
  let oldApp = base.readJsonFile('package', root).name;
  let newApp = data.name;
  base.updateJsonFile('package', root, data);
  if (oldApp !== newApp) {
    base.renameListByHandler([
      'navigation',
      'views',
      'wfviews'
    ], root, (name, stat)=> {
      let [prefix, app] = name.split('@');
      if (!app) {
        return null;
      }
      if (app === oldApp) {
        return `${prefix}@${newApp}`;
      }
      if (app === `${oldApp}.json`) {
        return `${prefix}@${newApp}.json`;
      }
    });
  }
}

function updateClasses (root, items) {
  base.emptyDir(path.join(root, 'meta'));
}

function updateNavSections (root, items) {
  base.emptyDir(path.join(root, 'navigation'));
}

function updateWorkflows (root, items) {
  base.emptyDir(path.join(root, 'workflows'));
  base.emptyDir(path.join(root, 'wfviews'));
}

function updateClass (root, id, data) {
  if (id !== data.name) {
    base.removeJsonFile(`meta/${id}.class`, root);
    base.renameFile(path.join(root, `views/${id}`), path.join(root, `views/${data.name}`));
    renameClassNavItemViews(root, id, data.name);
  }
  base.updateJsonFile(`meta/${data.name}.class`, root, data);
}

function updateView (root, id, data) {
  base.updateJsonFile(`views/${id}`, root, data);
}

function updateNavSection (root, id, data) {
  if (id !== data.name) {
    base.removeJsonFile(`navigation/${id}.section`, root);
    base.renameFile(path.join(root, `navigation/${id}`), path.join(root, `navigation/${data.name}`));
  }
  base.updateJsonFile(`navigation/${data.name}.section`, root, data);
}

function updateNavItem (root, id, data) {
  let [section, code] = id.split('/');
  if (code !== data.code) {
    base.removeJsonFile(`navigation/${section}/${code}`, root);
  }
  base.updateJsonFile(`navigation/${section}/${data.code}`, root, data);
}

function updateNavItemListView (root, id, data) {
  base.updateJsonFile(`views/${id}/list`, root, data);
}

function updateWorkflow (root, id, data) {
  let app = base.readJsonFile('package', root).name;
  base.removeDir(path.join(root, `wfviews/${id}@${app}`));
  base.removeJsonFile(`workflows/${id}.wf`, root);
  base.updateJsonFile(`workflows/${data.name}.wf`, root, data);
}

function updateWorkflowView (root, id, data) {
  base.updateJsonFile(`wfviews/${id}`, root, data);
}

function updateStudio (root, data) {
  base.updateJsonFile(`studio`, root, data);
}

function updateTasks (root, data) {
  base.updateJsonFile(`tasks`, root, data);
}

// REMOVE

function remove (item, root) {
  let {id} = item;
  switch (item.type) {
    case 'app':
      return removeApp(root);
    case 'class':
      return removeClass(root, id);
    case 'view':
      return removeView(root, id);
    case 'navSection':
      return removeNavSection(root, id);
    case 'navItem':
      return removeNavItem(root, id);
    case 'navItemListView':
      return removeNavItemListView(root, id);
    case 'workflow':
      return removeWorkflow(root, id);
    default:
      throw new Error('Invalid type');
  }
}

function removeApp (root) {
  base.removeDir(root);
}

function removeClass (root, id) {
  base.removeJsonFile(`meta/${id}.class`, root);
  base.removeDir(path.join(root, `views/${id}`));
}

function removeView (root, id) {
  base.removeJsonFile(`views/${id}`, root);
}

function removeNavSection (root, id) {
  base.removeJsonFile(`navigation/${name}.section`, root);
  base.removeDir(path.join(root, `navigation/${id}`));
}

function removeNavItem (root, id) {
  base.removeJsonFile(`navigation/${id}`, root);
}

function removeNavItemListView (root, id) {
  base.removeDir(path.join(root, `views/${id}`));
}

function removeWorkflow (root, id) {
  let app = base.readJsonFile('package', root).name;
  base.removeJsonFile(`workflows/${id}.wf`, root);
  base.removeDir(path.join(root, `wfviews/${id}@${app}`));
}

// RENAME

function renameClassNavItemViews (root, source, target) {
  let app = base.readJsonFile('package', root).name;
  source = `${source}@${app}`;
  target = `${target}@${app}`;
  base.renameByHandler(path.join(root, 'views'),
    (name, stat)=> name === source ? target : null
  );
}