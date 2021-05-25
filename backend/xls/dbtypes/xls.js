const xlsx = require('xlsx');

/**
 * Делает из xls или xlsx массив объектов
 * @param {String} path - путь к файлу
 * @param {boolean} compact - пропускать объекты, в которых все поля null
 * @returns {{headers: [], data: []}}
 */
module.exports = (file, compact = true) => {
  const xbook = xlsx.read(file);

  const out = {};

  for (const sheetName of Object.keys(xbook.Sheets)) {
    const sheet = xbook.Sheets[sheetName];
    out[sheetName] = {'headers': [], 'data': []};
    const topLeftmostCellAddress = sheet['!ref'].split(':')[0];
    const bottomRightmostCellAddress = sheet['!ref'].split(':')[1];
    const addressPattern = /^(\D+)(\d+)$/;
    const leftmostColumn = addressPattern.exec(topLeftmostCellAddress)[1];
    const rightmostColumn = addressPattern.exec(bottomRightmostCellAddress)[1];
    const firstRow = parseInt(addressPattern.exec(topLeftmostCellAddress)[2]);
    const lastRow = parseInt(addressPattern.exec(bottomRightmostCellAddress)[2]);

    if (!rightmostColumn)
      continue;

    const headers = [];
    const lastHeaderNum = lettersToIndex(rightmostColumn);
    const firstHeaderNum = lettersToIndex(leftmostColumn);
    for (let i = firstHeaderNum; i <= lastHeaderNum; i += 1) {
      const column = indexToLetters(i);
      if (sheet[column + firstRow])
        headers.push(sheet[column + firstRow].v);
      else
        headers.push(null);
    }
    const data = [];
    for (let row = firstRow + 1; row <= lastRow; row += 1) {
      const object = {};
      for (let column = firstHeaderNum; column <= lastHeaderNum; column += 1) {
        const header = headers[column - firstHeaderNum];
        if (header == null)
          continue;
        const columnAddress = indexToLetters(column);
        if (sheet[columnAddress + row])
          object[header] = sheet[columnAddress + row].v;
        else
          object[header] = null;
      }
      if (compact) {
        let nullCheck = false;
        for (const key of Object.keys(object))
          if (object[key] != null) {
            nullCheck = true
            break;
          }
        if (!nullCheck)
          continue;
      }
      data.push(object);
    }
    out[sheetName].headers = headers;
    out[sheetName].data = data;
  }

  return out;

  function lettersToIndex(letters) {
    const ALPHABET_POWER = 27;
    let total = 0;
    for (let i = letters.length - 1; i >= 0; i -= 1) {
      const value = Math.pow(ALPHABET_POWER, letters.length - 1 - i) * (letters.charCodeAt(i) - 64);
      total += value;
    }
    return total - 1 - Math.floor(total / ALPHABET_POWER);
  }

  function indexToLetters(index) {
    const ALPHABET_POWER = 27;
    let indexValue = index + 1 + Math.floor((index) / (ALPHABET_POWER - 1));
    let out = '';
    let power = -1;
    let multiplier;
    do {
      power += 1;
      multiplier = Math.pow(ALPHABET_POWER, power + 1);
    } while (indexValue / multiplier >= 1);

    while (power >= 0) {
      multiplier = Math.pow(ALPHABET_POWER, power);
      const charIndex = Math.floor(indexValue / multiplier);
      indexValue %= multiplier;
      out += String.fromCharCode(charIndex + 64);
      power -= 1;
    }
    return out;
  }
}
