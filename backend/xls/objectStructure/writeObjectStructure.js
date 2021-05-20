module.exports = writeObjectStructure;

const fs = require('fs');
const path = require('path');

const dataTarget = require('../target/data.json');

async function writeObjectStructure(objectStructure, namespace, destination) {
  const writingPromises = [];
  for (const className of Object.keys(objectStructure)) {
    const objects = objectStructure[className];
    for (const object of objects) {
      const objectPath = path.join(destination, `${className}@${namespace}@${object.guid}.json`);
      writingPromises.push(writeObjectData(object, className, namespace, dataTarget, objectPath));
    }
  }

  return await Promise.all(writingPromises);
}

async function writeObjectData(objectData, className, namespace, target, destination) {
  const dataToWrite = Object.assign({}, target, objectData);
  dataToWrite['_class'] = `${className}@${namespace}`;
  return new Promise((resolve, reject) => {
    fs.writeFile(destination, JSON.stringify(objectData, null, 2), () => resolve(destination))
  });
}
