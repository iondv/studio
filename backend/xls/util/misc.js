module.exports = {
  consolidateName,
  rmRecursively
};

const path = require('path');
const fs = require('fs');

function consolidateName(src) {
return src.split(' ')
    .map((part, i) =>
      i === 0 ?
        part
        : `${part[0].toUpperCase()}${part.slice(1)}`
    ).join('');
}

function rmRecursively(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, {}, (err, stat) => {
      if (err)
        return reject(err);

      if (stat.isDirectory()) {

        fs.readdir(filePath, {}, (err, innerFiles) => {
          if (err)
            return reject(err);

          const rmPromises = [];
          for (const innerFile of innerFiles) {
            const nextPath = path.join(filePath, innerFile);
            rmPromises.push(rmRecursively(nextPath));
          }
          Promise.all(rmPromises)
            .catch(err => reject(err))
            .then(() => {
              fs.rmdir(filePath, resolve);
            });
        });

      } else
        fs.unlink(filePath, resolve);
    });
  });
}
