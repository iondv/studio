module.exports = {
  all,
  one
}

const fs = require('fs');
const path = require('path');

function all(objects, metadataStructure) {
  const filters = fs.readdirSync(path.join(__dirname, 'filters'));
  for (const filterFile of filters) {
    const filterPath = path.join(__dirname, 'filters', filterFile);
    const filter = require(filterPath);
    one(filter, objects, metadataStructure);
  }
}

function one(filter, objects, metadataStructure) {
  for (const object of objects) {

    if (
      (typeof object === 'object')
      && (!Array.isArray(object))
    ) {
      for (const key of Object.keys(object)) {
        const value = object[key];
        const template = makeTemplate(value);
        if (template) {
          const filterTypes = Object.keys(filter);
          for (const filterType of filterTypes) {
            if ((RegExp(filterType).test(template))) {
              metadataStructure[key] = filter[filterType].structure;
              metadataStructure[key]['_deducedClass'] = filter[filterType].name;
              metadataStructure[key]['_dataType'] = 'object';
            }
          }
        }
        if (!metadataStructure[key]) {
          metadataStructure[key] = {};
          metadataStructure[key]['_dataType'] = typeof value;
        }
      }
      if (!metadataStructure['_dataType'])
        metadataStructure['_dataType'] = 'object';

    } else if (
      (typeof object === 'object')
      && (Array.isArray(object))
    ) {
      if (!metadataStructure['_dataType'])
        metadataStructure['_dataType'] = 'collection';

    } else {
      if (!metadataStructure['_dataType'])
        metadataStructure['_dataType'] = typeof object;
    }
  }
}

function makeTemplate(value) {
  let template = null;
  switch(typeof value) {
    case 'string':
      template = value;
      template = template.replace(/\d/g, '9');
      template = template.replace(/[a-zA-Z]/g, 'z');
      break;
    case 'number':
      template = String(value);
      template = template.replace(/\d/g, '9');
      break;
  }

  return template
}
