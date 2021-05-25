const Service = require('modules/rest/lib/interfaces/Service');
const appMaker = require('../backend/xls/appMaker');

function DbToMetadata(options) {
  this._route = function(router) {
    /**
     * @param {Request} req
     * @returns {Promise}
     * @private
     */
    this.addHandler(router, '/xls', 'PUT', (req) => {
      const chunks = [];
      return new Promise((resolve, reject) => {
        req.on('data', (chunk) => {
          chunks.push(chunk);
        });
        req.on('end', async () => {
          try {
            const source = Buffer.concat(chunks);
            const appName = 'generated-ion-app';
            const app = new appMaker(appName);
            const zip = await (app).fromXls(source);
            await app.clean();
            return resolve(zip);
          } catch (err) {
            console.error(err);
            return reject('conversion failed');
          }
        });
      });
    });
  };
}

DbToMetadata.prototype = new Service();

module.exports = DbToMetadata;
