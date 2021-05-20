module.exports = writeViewforms;

const fs = require('fs');
const path = require('path');
const {PROPERTY_NAMES_TO_IGNORE} = require('./constants.json');

const viewTargets = {
  create: require('../target/viewCreate.json'),
  item: require('../target/viewItem.json'),
  list: require('../target/viewList.json')
};
const viewPropertiesDir = path.join(__dirname, '..', 'target', 'viewProperty');

async function writeViewforms(metadataStructure, destination) {
  const writingPromises = [];
  for (const dataClassName of Object.keys(metadataStructure)) {
    writingPromises.push(writeClassViewforms(metadataStructure[dataClassName], dataClassName, 'create', viewTargets, destination));
    writingPromises.push(writeClassViewforms(metadataStructure[dataClassName], dataClassName, 'item', viewTargets, destination));
    writingPromises.push(writeClassViewforms(metadataStructure[dataClassName], dataClassName, 'list', viewTargets, destination));
  }

  return await Promise.all(writingPromises);
}

async function writeClassViewforms(dataClass, name, type, viewTargets, destination) {
  const classViewsPath = path.join(destination, name);
  if (!fs.existsSync(classViewsPath))
    fs.mkdirSync(classViewsPath);
  const newView = JSON.parse(JSON.stringify(viewTargets[type]));
  newView['name'] = name;
  newView['caption'] = `${name[0].toUpperCase()}${name.slice(1)}`;
  const viewPath = path.join(classViewsPath, `${type}.json`);

  const writingPromises = [];

  let propOrderNumber = 10;

  for (const propertyName of Object.keys(dataClass)) {
    if (PROPERTY_NAMES_TO_IGNORE.includes(propertyName))
      continue;
    const refClass = dataClass[propertyName]['_deducedClass']?
      dataClass[propertyName]['_deducedClass']
      : propertyName;
    const propertyType = dataClass[propertyName]._dataType;
    const property = Object.assign({}, require(path.join(viewPropertiesDir, `${propertyType}.json`)));
    if (propertyType === 'object') {
      if (!fs.existsSync(path.join(destination, refClass, 'create.json')))
        writingPromises.push(writeClassViewforms(dataClass[propertyName], refClass, 'create', viewTargets, destination));
      if (!fs.existsSync(path.join(destination, refClass, 'item.json')))
        writingPromises.push(writeClassViewforms(dataClass[propertyName], refClass, 'item', viewTargets, destination));
      if (!fs.existsSync(path.join(destination, refClass, 'list.json')))
        writingPromises.push(writeClassViewforms(dataClass[propertyName], refClass, 'list', viewTargets, destination));
    }

    property['property'] = propertyName;
    property['caption'] = `${propertyName[0].toUpperCase()}${propertyName.slice(1)}`;
    property['orderNumber'] = propOrderNumber;
    propOrderNumber += 10;

    if (
      (type === 'create')
      || (type === 'item')
    )
      newView.tabs[0].fullFields.push(property);
    else if (type === 'list')
      newView.columns.push(property);
  }

  writingPromises.push(new Promise((resolve, reject) => {
    fs.writeFile(viewPath, JSON.stringify(newView, null, 2), () => resolve(viewPath))
  }));

  return await Promise.all(writingPromises);
}
