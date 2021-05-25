module.exports = formDeploy;

const deployTarget = require('../target/deploy.json');

async function formDeploy(packageJson) {
  const deploy = Object.assign({}, deployTarget);
  for (const moduleName of Object.keys(packageJson.ionModulesDependencies)) {
    deploy.modules[moduleName] = {
      'globals': null,
      'import': null,
      'statics': null
    };
  }
  deploy['namespace'] = packageJson.name;
  return deploy;
}
