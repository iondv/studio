module.exports = serve;

const appMaker = require('../backend/xls/appMaker');

function serve(req, res) {
  try {
    const chunks = [];
    return new Promise((resolve) => {
      req.on('data', (chunk) => {
        chunks.push(chunk);
      });
      req.on('end', async () => {
        const source = Buffer.concat(chunks);
        const appName = 'generated-ion-app';
        const app = new appMaker(appName);
        const zip = await (app).fromXls(source);
        await app.clean();
        res.send(zip);
        return resolve(zip);
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.toString());
  }
}
