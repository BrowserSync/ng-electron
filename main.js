// ./main.js
const {app, BrowserWindow} = require('electron');

const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');

installExtension(REDUX_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

let win = null;

app.on('ready', function () {

    // Initialize the window to our specified dimensions
    win = new BrowserWindow({width: 1000, height: 600});

    // Specify entry point
    win.loadURL('http://localhost:4200');

    // Show dev tools
    // Remove this line before distributing
    win.webContents.openDevTools();

    // Remove window once app is closed
    win.on('closed', function () {
        win = null;
    });

});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});