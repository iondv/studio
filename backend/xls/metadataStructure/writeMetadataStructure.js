module.exports = writeMetadataStructure;

const fs = require('fs');
const path = require('path');
const {PROPERTY_NAMES_TO_IGNORE} = require('./constants.json');

const metadataTarget = require('../target/metadata.class.json');
const propertyTypesDir = path.join(__dirname, '..', 'target', 'metadataProperty');

async function writeMetadataStructure(metadataStructure, namespace, destination) {
  const writingPromises = [];
  for (const dataClassName of Object.keys(metadataStructure))
    writingPromises.push(writeMetadataClass(metadataStructure[dataClassName], dataClassName, namespace, metadataTarget, destination));

  return await Promise.all(writingPromises);
}

async function writeMetadataClass(dataClass, name, namespace, target, destination) {
  const newClass = JSON.parse(JSON.stringify(target));
  newClass['name'] = name;
  newClass['caption'] = `${name[0].toUpperCase()}${name.slice(1)}`;
  newClass['namespace'] = namespace;
  if (dataClass['_value'])
    newClass['semantic'] = dataClass['_value'];
  const classPath = path.join(destination, `${name}.class.json`);

  const writingPromises = [];

  let propOrderNumber = 20; // 10 is GUID

  for (const propertyName of Object.keys(dataClass)) {
    if (PROPERTY_NAMES_TO_IGNORE.includes(propertyName))
      continue;
    const refClass = dataClass[propertyName]['_deducedClass']?
      dataClass[propertyName]['_deducedClass']
      : propertyName;
    const propertyType = dataClass[propertyName]._dataType;
    const property = Object.assign({}, require(path.join(propertyTypesDir, `${propertyType}.json`)));
    if (propertyType === 'object') {
      if (!fs.existsSync(path.join(destination, `${refClass}.class.json`)))
        writingPromises.push(writeMetadataClass(dataClass[propertyName], refClass, namespace, target, destination));
      property['refClass'] = refClass;
    }

    property['name'] = propertyName;
    property['caption'] = `${propertyName[0].toUpperCase()}${propertyName.slice(1)}`;
    property['orderNumber'] = propOrderNumber;
    propOrderNumber += 10;

    newClass.properties.push(property);
  }

  writingPromises.push(new Promise((resolve, reject) => {
    fs.writeFile(classPath, JSON.stringify(newClass, null, 2), () => resolve(classPath))
  }));

  return await Promise.all(writingPromises);
}
