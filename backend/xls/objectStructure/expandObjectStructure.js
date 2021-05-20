module.exports = expandObjectStructure;

const uuid = require('uuid');
const {PROPERTY_NAMES_TO_IGNORE} = require('../metadataStructure/constants.json');

function expandObjectStructure(objectStructure, metadataStructure) {
  const expandedStructure = {};
  for (const className of Object.keys(objectStructure)) {
    const objects = objectStructure[className];
    for (const object of objects) {
      const expandedObject = expandObject(object, className, metadataStructure[className]);
      for (const innerClassName of Object.keys(expandedObject)) {
        const innerObjects = expandedObject[innerClassName];
        if (!expandedStructure[innerClassName])
          expandedStructure[innerClassName] = [];
        expandedStructure[innerClassName] = expandedStructure[innerClassName].concat(innerObjects);
      }
    }
  }
  return expandedStructure;
}

function expandObject(object, className, metadata) {
  const expandedObject = {};
  expandedObject[className] = [];
  const newObject = {};
  newObject['guid'] = uuid.v4();
  for (const propertyName of Object.keys(object)) {
    if (PROPERTY_NAMES_TO_IGNORE.includes(propertyName))
      continue;
    const property = object[propertyName];
    const propertyMetadata = metadata[propertyName];
    const type = propertyMetadata._dataType;
    if (type === 'object') {
      if (!property) {
        newObject[propertyName] = null;
        continue;
      }
      const innerObject = {};
      let innerClassName = propertyName;
      if (propertyMetadata._deducedClass) {
        innerClassName = propertyMetadata._deducedClass;
        innerObject[propertyMetadata._value] = property;
      }
      innerObject['guid'] = uuid.v4();
      if (!expandedObject[innerClassName])
        expandedObject[innerClassName] = [];
      expandedObject[innerClassName].push(innerObject);
      newObject[propertyName] = innerObject['guid'];
    } else {
      newObject[propertyName] = property;
    }
  }
  expandedObject[className].push(newObject);
  return expandedObject;
}
