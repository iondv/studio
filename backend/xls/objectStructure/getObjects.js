module.exports = getObjects;

const xls = require('../dbtypes/xls');

async function getObjects(file) {
  const xlsData = xls(file);
  const data = {};

  for (const sheetName of Object.keys(xlsData)) {
    const sheet = xlsData[sheetName];
    data[sheetName] = [];
    for (const xlsObject of sheet.data)
      data[sheetName].push(Object.assign({}, xlsObject));
  }

  return data; // JSON.stringify(data, null, 2);
}
