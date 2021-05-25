module.exports = prepareObjectStructure;

const miscUtils = require('../util/misc');
const translit = new (require('cyrillic-to-translit-js'))();

function prepareObjectStructure(rawObjectStructure) {
  return convertRawObject(rawObjectStructure);
}

function convertRawObject(object) {
  let newObject;
  if (!Array.isArray(object)) {
    newObject = {};
    for (const propertyName of Object.keys(object)) {
      const property = object[propertyName];
      const newPropertyName = translit.transform(miscUtils.consolidateName(propertyName));
      if (property && typeof property === 'object') {
        newObject[newPropertyName] = convertRawObject(object[propertyName]);
      } else {
        newObject[newPropertyName] = object[propertyName];
      }
    }
  } else {
    newObject = [];
    for (const property of object) {
      if (property && typeof property === 'object')
        newObject.push(convertRawObject(property));
      else
        newObject.push(property);
    }
  }
  return newObject;
}
