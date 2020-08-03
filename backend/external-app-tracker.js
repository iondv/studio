'use strict';

const fs = require('fs');
const request = require('request');

const config = {
  items: [],
  tempZip: 'applications/studio/temp.zip',
  updateInterval: 0 // seconds
};

module.exports = function (data) {
  if (data && Array.isArray(data.items) && data.items.length) {
    Object.assign(config, data);
    checkout().then(update);
    const frontItems = createFrontItems();
    return {
      getFrontItems: () => frontItems
    };
  }
};

function createFrontItems () {
  const frontItems = [];
  for (const item of config.items) {
    frontItems.push({
      title: item.title,
      url: getFrontLink(item),
      language: item.language
    });
  }
  return frontItems;
}

function getFrontLink ({name}) {
  return config.front + name + '.zip';
}

function getItemFile ({name}) {
  return config.storage + name + '.zip';
}

function checkout () {
  let queue = Promise.resolve();
  for (const item of config.items) {
    queue = queue.then(() => new Promise(checkoutItem.bind(this, item)));
  }
  return queue;
}

function update () {
  if (config.updateInterval) {
    setTimeout(() => {
      logInfo('Start updating');
      let queue = Promise.resolve();
      for (const item of config.items) {
        queue = queue.then(() => new Promise(downloadItem.bind(this, item)));
      }
      queue.then(update);
    }, config.updateInterval * 1000);
  }
}

function checkoutItem (item, resolve) {
  try {
    if (!fs.existsSync(getItemFile(item))) {
      return downloadItem(item, resolve);
    }
    logInfo(`File exists: ${item.name}`);
    resolve();
  } catch (err) {
    logError(`Checkout failed: ${item.name}`, err);
    resolve();
  }
}

function downloadItem (item, resolve) {
  try {
    if (!item.url) {
      return logInfo(`No URL: ${item.name}`);
    }
    logInfo(`Request: ${item.name}: ${item.url}`);
    request(item.url, err => {
      if (err) {
        logError(`Request failed: ${item.name}`, err);
        resolve();
      }
    }).pipe(fs.createWriteStream(config.tempZip))
      .on('error', err => {
        logError(`Pipe failed: ${item.name}:`, err);
        resolve();
      })
      .on('close', () => {
        logInfo(`Downloaded: ${item.name}`);
        fs.promises.rename(config.tempZip, getItemFile(item))
          .then(() => {
            logInfo(`Done: ${item.name}`);
            resolve();
          })
          .catch(err => {
            logError(`Rename failed: ${item.name}`, err);
            resolve();
          });
      });
  } catch (err) {
    logError(`Download failed: ${item.name}`, err);
    resolve();
  }
}

function logInfo () {
  log('log', ...arguments);
}

function logError () {
  log('error', ...arguments);
}

function log (type, message, ...args) {
  console[type](`ExternalAppTracker: ${message}`, ...args);
}