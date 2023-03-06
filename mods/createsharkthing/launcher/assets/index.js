const {ipcRenderer} = require("electron")
var audio = new Audio('./assets/notifcation.mp3');
audio.play();
ipcRenderer.send("init")

ipcRenderer.on("", (data, dat) => {

})