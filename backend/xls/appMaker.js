const fs = require('fs');
const uuid = require('uuid');
const path = require('path');
const metadataStructureUtil = require('./metadataStructure/index');
const objectStructureUtil = require('./objectStructure/index');
const archiver = require('archiver');
const miscUtil = require('./util/misc');

class appMaker {

  constructor(appName) {
    this.name = appName;
  }

  async prepareAppStructure() {
    const includedFolders = [
      'data',
      'meta',
      'navigation',
      'themes',
      'views',
      'workflows'
    ];

    this.folders = {};
    this.folders['app'] = await prepareAppStructure(includedFolders);
    for (const folderName of includedFolders)
      this.folders[folderName] = path.join(this.folders.app, folderName);

    return this.folders;
  }

  async writePackageJson(moduleDependencies, appDependencies) {
    this.moduleDependencies = moduleDependencies;
    this.appDependencies = appDependencies;
    this.packageJson = await formPackageJson(this.name, this.moduleDependencies, this.appDependencies);

    const packageJsonPath = path.join(this.folders.app, 'package.json');
    fs.writeFileSync(packageJsonPath, JSON.stringify(this.packageJson, null, 2));
    return packageJsonPath;
  }

  async writeDeploy() {
    this.deploy = await metadataStructureUtil.formDeploy(this.packageJson);

    const deployPath = path.join(this.folders.app, 'deploy.json');
    fs.writeFileSync(deployPath, JSON.stringify(this.deploy, null, 2));
    return deployPath;
  }

  async writeMetadataStructure(metadataStructure) {
    return await metadataStructureUtil.writeMetadataStructure(metadataStructure, path.join(this.folders.app, 'meta'));
  }

  async fromXls(xls) {
    await this.buildApp(await objectStructureUtil.getObjects(xls));
    return await this.zip();
  }

  async buildApp(source) {
    await this.prepareAppStructure();
    this.objectStructure = objectStructureUtil.prepareObjectStructure(source);
    this.metadataStructure = await metadataStructureUtil.deduceMetadata(this.objectStructure);
    await metadataStructureUtil.writeMetadataStructure(this.metadataStructure, this.name, this.folders.meta);
    await this.writePackageJson({'registry': '*'}, {});
    await this.writeDeploy();
    this.objectStructure = await objectStructureUtil.expandObjectStructure(this.objectStructure, this.metadataStructure);
    await objectStructureUtil.writeObjectStructure(this.objectStructure, this.name, this.folders.data);
    await metadataStructureUtil.writeNavigation(this.metadataStructure, this.folders.navigation);
    await metadataStructureUtil.writeViewforms(this.metadataStructure, this.folders.views)
  }

  zip() {
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', {
        zlib: {level: 9}
      });
      archive.directory(this.folders.app, this.name, {name: this.name});
      let chunks = [];
      let data;
      archive.on('data', (chunk) => {
        chunks = chunks.concat(chunk);
      });
      archive.on('end', () => {
        data = Buffer.concat(chunks);
        resolve(data);
      });
      archive.finalize();
    });
  }

  async clean() {
    return await miscUtil.rmRecursively(this.folders.app);
  }
}

async function prepareAppStructure(includedFolders) {
  const tempFolder = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempFolder))
    await fs.mkdirSync(tempFolder);
  const appFolder = path.join(tempFolder, uuid.v4());
  await fs.mkdirSync(appFolder);

  const fsPromises = [];
  for (const folder of includedFolders) {
    fsPromises.push(new Promise((resolve, reject) => {
      fs.mkdir(path.join(appFolder, folder), null, (err) => {
        if (err)
          return reject(err);
        return resolve();
      });
    }));
  }
  await Promise.all(fsPromises);
  return appFolder;
}

async function formPackageJson(appName, moduleDependencies, appDependencies) {
  const packageJson = {
    name: appName,
    description: '',
    version: '1.0.0',
    ionModulesDependencies: {},
    ionMetaDependencies: {},
  };
  packageJson.ionModulesDependencies = moduleDependencies || {};
  packageJson.ionMetaDependencies = appDependencies || {};
  return packageJson;
}

module.exports = appMaker;
