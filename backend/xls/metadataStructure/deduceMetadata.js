const applyFilter = require('./applyFilter');

module.exports = async function deduceMetadata(objectStructure) {
  const metadataStructure = {};

  for (const objectClass of Object.keys(objectStructure)) {
    metadataStructure[objectClass] = {};
    applyFilter.all(objectStructure[objectClass], metadataStructure[objectClass]);
  }

  return metadataStructure;
}
