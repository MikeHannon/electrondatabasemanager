const {app, BrowserWindow,ipcMain} = require('electron')
//SQL
const exec = require('child_process').exec;
const mySQL = exec('mysql.server start');
const MYSQL = require("mysql");


let win

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600})
  win.loadURL(`file://${__dirname}/index.html`)
  win.webContents.openDevTools()
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    exec(`mysql.server stop`,(error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }


      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });

    win = null
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})



// communication
let connection = ''
ipcMain['onReceiptOf'] = ipcMain.on;
ipcMain.onReceiptOf('dataForMySQLConnection', (event, arg) => {
  let p = arg[0];
  let u = arg[1];
  let pw = arg[2];
  exec(`mysql.server start -P ${p?p:'3306'}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    connection = MYSQL.createConnection({
      host: `127.0.0.1`,
      user: `${u?u:'root'}`,
      password:`${pw?pw:''}`,
      port: p?p:3306
    });
    connection.query('SHOW DATABASES;', function(err,result){
      event.sender.send('databases', result)
    })

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
  event.sender.send('synchronous-reply', '')
})
ipcMain.onReceiptOf('schemaToLoad',(event,arg)=>{
console.log(arg[0].value);
connection.query(`USE ${arg[0].value};`);
connection.query(`SHOW TABLES;`, function(err, result){
  console.log(result);
for (var i = 0; i < result.length; i++) {
  console.log(result[i][`Tables_in_${arg[0].value}`]);
}
} )

})
