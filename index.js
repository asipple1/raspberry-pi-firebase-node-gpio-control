const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const LED = new Gpio(4, 'out')
const firebase = require("firebase");
const config = {
    apiKey: "AIzaSyBn2MGA2GZ0TdDDAqeP4u31VC_9g4vR6BE",
    authDomain: "raspberrypi-vue.firebaseapp.com",
    databaseURL: "https://raspberrypi-vue.firebaseio.com",
    projectId: "raspberrypi-vue",
    storageBucket: "",
    messagingSenderId: "1012869981743"
};
firebase.initializeApp(config);

// Create References
const dbRefObject = firebase.database().ref().child("object");

// Sync Object changes
dbRefObject.on("value", snap => {
    let lightValue = snap.val().light;
    turnLightOnOrOff(lightValue);
});

function turnLightOnOrOff(val) {
    if(val) {
        console.log('turning light on');
        LED.writeSync(0);
    }
    else {
        console.log('turning light off');
        LED.writeSync(1);
    }
}
