/*eslint "require-jsdoc": off,  "no-console": off, "no-sync": off*/

const {series, parallel} = require('gulp');
const gulpSrc = require('gulp').src;
const gulpDest = require('gulp').dest;
const assert = require('assert');

const less = require('gulp-less');
const cssMin = require('gulp-clean-css');
const jsMin = require('gulp-jsmin');
const rename = require('gulp-rename');
const spawn = require('child_process').spawn;
const extend = require('extend');

const fs = require('fs');
const path = require('path');


const platformPath = path.normalize(__dirname);
const commandExtension = /^win/.test(process.platform) ? '.cmd' : '';

// assert.ok(process.env.NODE_PATH,
//   '\x1b[93;41mThe NODE_PATH must be specified with the path to the application launch directory:\x1b[0m ' + __dirname.toLowerCase());

//const nodePath = process.env.NODE_PATH.toLowerCase();

// assert.notEqual(nodePath.indexOf(__dirname.toLowerCase()), -1,
//   '\x1b[93;41mNODE_PATH must contain the path to the application launch directory.\x1b[0m\nСейчас:           ' +
//              nodePath + '\nMust contain: ' + __dirname.toLowerCase());


/*******************************
* Build tasks
********************************/

/**
 * Initializing the primary application.
 * First cleaned up folders and installed all modules.
 */
const build = series(parallel(buildBackendNpm, buildFrontend, buildBower, compileLessAll),
  parallel(minifyCssAll, minifyJsAll));

const minify = series(compileLessAll, minifyCssAll, minifyJsAll);

// For studio app - build only
const assemble = series(build);

function compileLessAll (done) {
  let themes = themeDirs();
  let start = null;
  for (let i = 0; i < themes.length; i++) {
    if (start) {
      start = start.then(compileLess(themes[i]));
    } else {
      start = compileLess(themes[i])();
    }
  }
  if (!start) {
    start = Promise.resolve();
  }

  start.then(function () {
    done();
  })
    .catch(function (err) {
      console.error(err);
      done(err);
    });
}

function minifyCssAll(done) {
  let themes = themeDirs();
  let start = null;
  for (let i = 0; i < themes.length; i++) {
    if (start) {
      start = start.then(minifyCSS(themes[i]));
    } else {
      start = minifyCSS(themes[i])();
    }
  }
  if (!start) {
    start = Promise.resolve();
  }
  start
    .then(done)
    .catch(function (err) {
      console.error(err);
      done(err);
    });
}

function minifyJsAll(done) {
  let themes = themeDirs();
  let start = null;
  for (let i = 0; i < themes.length; i++) {
    if (start) {
      start = start.then(minifyJS(themes[i]));
    } else {
      start = minifyJS(themes[i])();
    }
  }
  if (!start) {
    start = Promise.resolve();
  }
  start
    .then(done)
    .catch(function (err) {
      console.error(err);
      done(err);
    });
}

function buildBackendNpm(done) {
  npm(platformPath)()
    .then(done)
    .catch((err) => {
      console.error(err);
      done(err)});
}

function buildFrontend(done) {
  let themes = themeDirs();
  let start = null;
  for (let i = 0; i < themes.length; i++) {
    if (start) {
      start = start.then(frontendInstall(themes[i]));
    } else {
      start = frontendInstall(themes[i])();
    }
  }
  if (!start) {
    start = Promise.resolve();
  }
  start
    .then(function () {
      done();
    })
    .catch(function (err) {
      console.error(err);
      done(err);
    });
}

function buildBower(done) {
  let themes = themeDirs();
  let start = null;
  for (let i = 0; i < themes.length; i++) {
    if (start) {
      start = start.then(bowerInstall(themes[i]));
    } else {
      start = bowerInstall(themes[i])();
    }
  }
  if (!start) {
    start = Promise.resolve();
  }
  start
    .then(function () {
      done();
    })
    .catch(function (err) {
      console.error(err);
      done(err);
    });
}

/*******************************
 * Service function
 ********************************/

function npm(pathDir) {
  return function () {
    return new Promise(function (resolve, reject) {
      let npmArgs = ['install', '--no-save', '--prefer-offline']; // TODO '--only=prod' if use - delete gulp in devDependce
      try {
        fs.accessSync(path.join(pathDir, 'package-lock.json'));
        console.log('Installing CI the backend packages for the path ' + pathDir); // TODO '--only=prod' if use - delete gulp in devDependce
        npmArgs = ['ci', '--prefer-offline'];
      } catch (error) {
        console.log('Installing the backend packages for the path ' + pathDir);
      }
      run(pathDir, 'npm', npmArgs, resolve, reject);
    });
  };
}

function frontendInstall(pathDir) {
  return function () {
    return new Promise(function (resolve, reject) {
      try {
        fs.accessSync(path.join(pathDir, 'package.json'));
      } catch (error) {
        resolve();
        return;
      }
      try {
        /**
         * Configuration parameters
         * @property {String} vendorDir - package installation folder
         */
        let packageJson = JSON.parse(fs.readFileSync(path.join(pathDir, 'package.json'), {encoding: 'utf-8'}));
        if (!packageJson.vendorDir) {
          console.warn('In the package.json the destination directory for vendor files is not specified in [vendorDir]!\nSet default ./static/vendor');
          packageJson.vendorDir = './static/vendor';
        }
        let npmArgs = ['install', '--only=prod', '--no-save', '--prefer-offline'];
        try {
          fs.accessSync(path.join(pathDir, 'package-lock.json'));
          console.log('Installing CI the frontend packages for the path ' + pathDir);
          npmArgs = ['ci', '--only=prod', '--prefer-offline'];
        } catch (error) {
          console.log('Installing the frontend packages for the path ' + pathDir);
        }
        run(pathDir, 'npm', npmArgs, function () {
          const srcDir = path.join(pathDir, 'node_modules');
          try {
            fs.accessSync(srcDir);
          } catch (err) {
            resolve();
            return;
          }
          try {
            const vendorModules = fs.readdirSync(srcDir);
            let copyers = [];
            let copyer;
            for (let i = 0; i < vendorModules.length; i++) {
              copyer = copyVendorResources(srcDir, path.join(pathDir, packageJson.vendorDir), vendorModules[i]);
              if (copyer) {
                copyers.push(copyer);
              }
            }
            if (copyers.length) {
              Promise.all(copyers).then(resolve).catch(reject);
              return;
            }
          } catch (error) {
            return reject(error);
          }
          resolve();
        }, reject);

      } catch (error) {
        reject(error);
      }
    });
  };
}

function bowerInstall(pathDir) {
  return function () {
    return new Promise(function (resolve, reject) {
      try {
        fs.accessSync(path.join(pathDir, '.bowerrc'));
      } catch (error) {
        resolve();
        return;
      }
      try {
        /**
         * Параметры конфигурации bower
         * @property {String} vendorDir - папка установки пакетов
         */
        let bc = JSON.parse(fs.readFileSync(path.join(pathDir, '.bowerrc'), {encoding: 'utf-8'}));
        console.warn('DEPRICATED installing the bower packages for the path ' + pathDir + ' use npm');
        run(pathDir, 'bower', ['install', '--config.interactive=false', '--allow-root'], function () {
          let srcDir = path.join(pathDir, bc.directory);
          try {
            fs.accessSync(srcDir);
          } catch (err) {
            resolve();
            return;
          }
          try {
            let vendorModules = fs.readdirSync(srcDir);
            let copyers, copyer;
            copyers = [];
            if (bc.vendorDir) {
              for (let i = 0; i < vendorModules.length; i++) {
                copyer = copyVendorResources(srcDir, path.join(pathDir, bc.vendorDir), vendorModules[i]);
                if (copyer) {
                  copyers.push(copyer);
                }
              }
            } else {
              console.warn('In the .bowerrc the destination directory for vendor files is not specified in!');
            }
            if (copyers.length) {
              Promise.all(copyers).then(resolve).catch(reject);
              return;
            }
          } catch (error) {
            return reject(error);
          }
          resolve();
        }, reject);
      } catch (error) {
        reject(error);
      }
    });
  };
}

function copyVendorResources(src, dst, module) {
  return new Promise(function (resolve, reject) {
    let dist = path.join(src, module, 'dist');
    let min = path.join(src, module, 'min');
    let dest = path.join(dst, module);

    copyResources(
      dist,
      dest,
      'Copied distribution files of vendor package ' + module
    )(false).then(copyResources(
      min,
      dest,
      'Copied minified files vendor package ' + module
      )
    ).then(copyResources(
      path.join(src, module),
      dest,
      'Copied vendor package files ' + module
      )
    ).then(resolve).catch(reject);
  });
}

function copyResources(srcPath, destPath, msg) {
  return function (skip) {
    return new Promise(function (resolve, reject) {
      if (!skip) {
        try {
          fs.accessSync(srcPath);
        } catch (err) {
          resolve(false);
          return;
        }
        gulpSrc([path.join(srcPath, '**', '*')])
          .pipe(gulpDest(destPath))
          .on('finish', function () {
            console.log(msg);
            resolve(true);
          })
          .on('error', reject);
      } else {
        resolve(true);
      }
    });
  };
}

function compileLess(p) {
  return function () {
    return new Promise(function (resolve, reject) {
      if (!fs.existsSync(path.join(p, 'less'))) {
        return resolve();
      }
      console.log('Compiling less files for the path ' + p);
      try {
        gulpSrc([path.join(p, 'less', '*.less')])
          .pipe(less({
            paths: [path.join(p, 'less', '*.less')]
          }))
          .pipe(rename({
            suffix: '.less'
          }))
          .pipe(gulpDest(path.join(p, 'static', 'css')))
          .on('finish', resolve)
          .on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  };
}

function minifyCSS(p) {
  return function () {
    return new Promise(function (resolve, reject) {
      if (!fs.existsSync(path.join(p, 'static', 'css'))) {
        return resolve();
      }
      console.log('Minification of front-end style files for the path ' + p);
      try {
        gulpSrc([
          path.join(p, 'static', 'css', '*.css'),
          '!' + path.join(p, 'static', 'css', '*.min.css')
        ], {base: path.join(p, 'static', 'css')})
          .pipe(cssMin({rebase: false}))
          .pipe(rename({suffix: '.min'}))
          .pipe(gulpDest(path.join(p, 'static', 'css')))
          .on('finish', resolve)
          .on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  };
}

function minifyJS(p) {
  return function () {
    return new Promise(function (resolve, reject) {
      if (!fs.existsSync(path.join(p, 'static', 'js'))) {
        return resolve();
      }

      console.log('Minification frontend script files for the path ' + p);
      try {
        gulpSrc(
          [
            path.join(p, 'static', 'js', '*.js'),
            '!' + path.join(p, 'static', 'js', '*.min.js')
          ], {base: path.join(p, 'static', 'js')})
          .pipe(jsMin())
          .pipe(rename({suffix: '.min'}))
          .pipe(gulpDest(path.join(p, 'static', 'js')))
          .on('finish', resolve)
          .on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  };
}

function run(path, command, args, resolve, reject) {
  try {
    let child = spawn(command + commandExtension,
      args,
      {
        cwd: path,
        env: process.env
      }
    );

    child.stdout.on('data', function (data) {
      console.log(data.toString('utf-8'));
    });

    child.stderr.on('data', function (data) {
      console.error(data.toString('utf-8'));
    });

    child.on('close', function (code) {
      if (code !== 0) {
        return reject('child process failed with code ' + code);
      }
      return resolve();
    });
  } catch (error) {
    reject(error);
  }
}

function buildDir(start, dir) {
  let modulesDir = path.join(platformPath, dir);
  let modules = fs.readdirSync(modulesDir);
  let stat;
  let f = start;
  for (let i = 0; i < modules.length; i++) {
    stat = fs.statSync(path.join(modulesDir, modules[i]));
    if (stat.isDirectory()) {
      f = f.then(npm(path.join(modulesDir, modules[i])));
    }
  }
  return f;
}

function themeDirs() {
  let themes = _themeDirs(path.join(platformPath, 'themes'));
  //Array.prototype.push.apply(themes, _themeDirs(themesDir));


  // pth = path.join(platformPath);//, 'applications');
  // tmp = fs.readdirSync(pth);
  // tmp.forEach(function (dir) {
  //   let module = path.join(pth, dir);
  //   let stat = fs.statSync(module);
  //   if (stat.isDirectory()) {
  //     let themesDir = path.join(module, 'themes');
  //     if (fs.existsSync(themesDir)) {
  //       Array.prototype.push.apply(themes, _themeDirs(themesDir));
  //     } else {
  //       themes.push(module);
  //     }
  //   }
  // });
  return themes;
}

function _themeDirs(basePath) {
  let themes = [];
  if (fs.existsSync(basePath)) {
    let tmp = fs.readdirSync(basePath);
    tmp.forEach(function (dir) {
      let theme = path.join(basePath, dir);
      let stat = fs.statSync(theme);
      if (stat.isDirectory()) {
        themes.push(theme);
      }
    });
  }
  return themes;
}

exports.build = build;
exports.assemble = assemble;
exports.default = assemble;
exports.buildBackendNpm = buildBackendNpm;
exports.buildFrontend = buildFrontend;
exports.buildBower = buildBower;
exports.minify = minify;
