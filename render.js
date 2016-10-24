console.log('hello');
const {ipcRenderer} = require('electron');
document.getElementById('click').addEventListener('click',(e)=>{
let serverPort = document.getElementById('server');
let userName = document.getElementById('username').value;
let password = document.getElementById('password').value;
if (parseInt(serverPort.value) != NaN && parseInt(serverPort.value) > 3000 && parseInt(serverPort.value) < 60000){
ipcRenderer.send('synchronous-message',[parseInt(serverPort.value),userName,password]);
}
else{
console.log('no good');
}
});

ipcRenderer.on('synchronous-reply',(event,arg)=>{console.log("SQL Server Started");})

ipcRenderer.on('databases',(event,arg)=>{
  for (var i = 0; i < arg.length; i++) {
    console.log(arg[i].Database);
  }
})
