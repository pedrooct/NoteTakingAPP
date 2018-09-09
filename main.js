const electron = require('electron');
const url = require('url');
const path = require("path");
var sqlite3 = require('./server/sqlite.js');
var list = "";
const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

app.on('ready', function(){
  sqlite3.startDB();
  mainWindow= new BrowserWindow({
    title: 'NoteTakingApp',
    icon: __dirname + '/assets/icons/icon.png',
    width: 1024,
    height: 720
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setMaximizable(false)
  mainWindow.setResizable(false)
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'page.html'),
    protocol: 'file:',
    slashes: true
  }));
  mainWindow.on('closed', function(){
    sqlite3.closeDB();
    app.quit();
  });
  sqlite3.queryAllNotes().then(function(row){
    mainWindow.webContents.on('did-finish-load',()=>{
      mainWindow.webContents.send('note:list',row);
    });
  }).catch(function(err){
    console.log("error");
  });
});

//catch note:add
ipcMain.on('note:add',function(e,title,note){
  //note = note.replace(/\s/g, '');
  note= note.trim();
  sqlite3.addNote(title,note);
  sqlite3.queryAllNotes().then(function(row){

    mainWindow.webContents.send('note:list',row);
  }).catch(function(err){
    console.log("");
  });
});

//delete Note
ipcMain.on('note:remove',function(e,id){
  sqlite3.deleteNote(id);
  sqlite3.queryAllNotes().then(function(row){
    mainWindow.webContents.send('note:list',row);
  }).catch(function(err){
    console.log("");
  });
});
