const {ipcRenderer} = require('electron');
const $ = require('./bower_components/jquery/dist/jquery');

ipcRenderer['onReceiptOf']=ipcRenderer.on
let portNumber = 3306;
document.getElementById('click').addEventListener('click',(e)=>{
let serverPort = document.getElementById('server');
let userName = document.getElementById('username').value;
let password = document.getElementById('password').value;
if (parseInt(serverPort.value) != NaN && parseInt(serverPort.value) > 3000 && parseInt(serverPort.value) < 60000){
  portNumber =parseInt(serverPort.value);
  ipcRenderer.send('dataForMySQLConnection',[parseInt(serverPort.value),userName,password]);
}
else{
ipcRenderer.send('dataForMySQLConnection',[]);
}
});

ipcRenderer.onReceiptOf('synchronous-reply',(event,arg)=>{console.log("SQL Server Started");})

ipcRenderer.onReceiptOf('databases',(event,arg)=>{
// change to react?
  let body = document.getElementsByTagName('body')[0];
  let bodyString = `<h3>We are currently using MySQL on port: ${portNumber}</h3> <form action="#">
  <select id="table" name="table">`;
  for (let i = 0; i < arg.length; i++) {
    bodyString += `
    <option value="${arg[i].Database}">${arg[i].Database}</option>`;
  }
  bodyString += `</select>
  <input id = "formSubmit" type="button" value = "Load Schema">
  </form>`;
  body.innerHTML += bodyString;
});
$(document).ready(function(){
$(document).on('click',`#formSubmit`, function(e){
  ipcRenderer.send('schemaToLoad', $(this).parent().serializeArray());

})

})
