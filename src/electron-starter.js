const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
var express = require('express');
var appexpress = express();
var server = require('http').Server(appexpress);
var io = require('socket.io')(server);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let messages = [{
    id: 1,
    text: "Hola soy un mensaje",
    author: "hushino"
}];
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    // and load the index.html of the app.
    mainWindow.loadURL('http://localhost:3000');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
    appexpress.get('/hello', function (req, res) {
        res.status(200).send("Hello World!");
    });

    io.on('connection', function (socket) {
        /* socket.emit('messages', messages);
        socket.on('new-message', function (data) {
            messages.push(data);
            io.sockets.emit('messages', messages);
        }); */
        socket.on('new-message', body => {
            socket.broadcast.emit("messages", {
                body,
                from: socket.id.slice(8)
            })
        })
    });

    server.listen(8080, function () {
        console.log("Servidor corriendo en http://localhost:8080");
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.