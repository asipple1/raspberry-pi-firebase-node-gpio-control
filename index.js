const Gpio = require('onoff').Gpio;

const relayOne = new Gpio(2, 'out');
const relayTwo = new Gpio(3, 'out');
const relayThree = new Gpio(4, 'out');
const relayFour = new Gpio(17, 'out');
const relayFive = new Gpio(27, 'out');
const relaySix = new Gpio(22, 'out');
const relaySeven = new Gpio(10, 'out');
const relayEight = new Gpio(9, 'out');

const relayArray = [relayOne, relayTwo, relayThree, relayFour, relayFive, relaySix, relaySeven, relayEight];

let indexCount = 0; //a counter
let dir = "up"; //variable for flowing direction
let cyclonInterval;

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
    let relayOneValue = snap.val().relay_one;
    let cyclonValue = snap.val().cyclon;
    if(cyclonValue != true) {
        relayOneOnOff(relayOneValue);
    }
    if(relayOneValue != true) {
        activateCyclon(cyclonValue);
    }
});

function relayOneOnOff(val) {
    if(val) {
        console.log('turning light on');
        relayOne.writeSync(0);
    }
    else {
        console.log('turning light off');
        relayOne.writeSync(1);
    }
}

// CYCLON
function activateCyclon(val) {
    if(val) {
        console.log('Cyclon Activated');
        cyclonInterval = setInterval(flowingLeds, 300); //run the flowingLeds function every 300ms
    }
    else {
        console.log('Cyclon Deactivated');
        clearInterval(cyclonInterval);
        for (let relay of relayArray) {
            relay.writeSync(1);
        }
    }
}


function flowingLeds() { //function for flowing Leds
    relayArray.forEach(function(currentValue) { //for each item in array
        currentValue.writeSync(1); //turn off LED
    });
    if (indexCount == 0) dir = "up"; //set flow direction to "up" if the count reaches zero
    if (indexCount >= relayArray.length) dir = "down"; //set flow direction to "down" if the count reaches 7
    if (dir == "down") indexCount--; //count downwards if direction is down
    relayArray[indexCount].writeSync(0); //turn on LED that where array index matches count
    if (dir == "up") indexCount++ //count upwards if direction is up
};
