// ./main.js
const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const {init, Methods} = require('bs-lite');
const {bs, system} = init();
const {join} = require('path');
const {format} = require('url');

require('dotenv').config();

let win = null;
let options = null;

app.on('ready', createWindow);

function createWindow() {

  // Initialize the window to our specified dimensions
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      webSecurity: false
    }
  });

  if (process && process.env && process.env.DEV === 'true') {
    const {default: installExtension, REDUX_DEVTOOLS} = require('electron-devtools-installer');

    installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));

    win.loadURL(process.env.HOST);
    win.webContents.openDevTools();
  } else {
    // production
    win.loadURL('file://' + __dirname + '/ng-dist/index.html');
  }

  // Show dev tools
  // Remove this line before distributing

  // Remove window once app is closed
  win.on('closed', function () {
    win = null;
    bs.ask(Methods.Stop)
      .subscribe(() => {
        console.log('Stopped!');
      });
  });
}

ipcMain.on('options', (event, data) => {
  options = data;
  bs.ask(Methods.Init, prepareForBs(options))
    .map(({errors, output}) => {
      if (errors.length) {
        return {
          type: 'error',
          payload: {
            errors
          }
        }
      }
      return {
        type: 'success',
        payload: {
          port: output.server.address().port,
          options: output.options.toJS(),
        }
      }
    })
    .do((action) => {
      win.webContents.send(action.type, action.payload);
    })
    .subscribe()
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

exports.stopBs = function (cb) {
  bs.ask(Methods.Stop)
    .subscribe(() => {
      console.log('stopped');
      cb();
    });
}

exports.initBs = function initBs(options, cb) {
  const bsOptions = prepareForBs(options);
  bs.ask(Methods.Init, bsOptions)
    .do(({errors, output}) => {
      if (errors.length) {
        return cb(errors[0]);
      } else {
        const port = output.server.address().port;
        const ex = require('dev-ip')();
        const urls = getUrls(port, ex, output.options.toJS());
        return cb(null, {
          port: output.server.address().port,
          urls,
        });
      }
    })
    .subscribe(() => {

    }, err => console.log(err));
}

function getUrls(port, ip, options) {
  return [
    `${options.scheme}://localhost:${port}`,
    `${options.scheme}://${ip}:${port}`,
    `${options.scheme}://${ip}.xip.io:${port}`,
  ]
}

exports.selectDirectory = function selectDirectory(cb) {
  dialog.showOpenDialog(win, {
    properties: ['openDirectory', 'openFile']
  }, cb);
};

function prepareForBs(opts) {
  const activeProxies = opts.proxies.filter(x => x.active);
  const hasHttps = activeProxies.some(x => x.target.startsWith('https'));

  const outputing = {
    scheme: hasHttps ? 'https' : 'http',
    proxy: activeProxies.map(x => x.target),
    server: {
      port: Number(opts.port)
    },
    serveStatic: opts.mappings
  };

  console.log(JSON.stringify(outputing, null, 2));

  return outputing;
}
