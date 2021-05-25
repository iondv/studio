module.exports = writeNavigation;

const fs = require('fs');
const path = require('path');

const navigationSectionTarget = require('../target/navigationSection.section.json');
const navigationNodeTarget = require('../target/navigationNode.json');

async function writeNavigation(metadataStructure, destination) {
  const writingPromises = [];
  const navigationSectionPath = path.join(destination, 'generated.section.json');
  const navigationSection = Object.assign({}, navigationSectionTarget);
  navigationSection['name'] = 'generated';
  navigationSection['caption'] = 'Generated';

  writingPromises.push(new Promise((resolve, reject) => {
    fs.writeFile(navigationSectionPath, JSON.stringify(navigationSection, null, 2), () => resolve(navigationSectionPath))
  }));
  const nodesFolder = path.join(destination, 'generated');
  if (!fs.existsSync(nodesFolder))
    fs.mkdirSync(nodesFolder);
  let nodeOrderNumber = 10;
  for (const dataClassName of Object.keys(metadataStructure)) {
    const nodePath = path.join(nodesFolder, `${dataClassName}.json`);
    writingPromises.push(writeNavigationNode(metadataStructure[dataClassName], dataClassName, nodeOrderNumber, navigationNodeTarget, nodePath));
    nodeOrderNumber += 10;
  }

  return await Promise.all(writingPromises);
}

async function writeNavigationNode(dataClass, name, orderNumber, target, destination) {
  const node = Object.assign({}, target);
  node['code'] = name;
  node['caption'] = `${name[0].toUpperCase()}${name.slice(1)}`;
  node['classname'] = name;
  node['orderNumber'] = orderNumber;

  return new Promise((resolve, reject) => {
    fs.writeFile(destination, JSON.stringify(node, null, 2), () => resolve(destination))
  });
}
