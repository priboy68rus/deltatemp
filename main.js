const API_URL = "https://api.apixu.com/v1/";
const API_KEY = "5ab92edabc6c433188065649183110";

var delta = document.querySelector(".delta");
// var deltaf = document.querySelector(".deltaf");
var curr = document.querySelector(".curr");
// var currf = document.querySelector(".currf");
var main_row = document.querySelector(".main-row");
var header = document.querySelector(".header");
var switchElement = document.querySelector("#switch");

var current_location;
var location_string;

var curr_c;
var curr_f;

var delta_c;
var delta_f;

window.addEventListener('load', (e) => {
    getLocation();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            current_location = `${pos.coords.latitude},${pos.coords.longitude}`;
            setCurrentWeather();
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function setCurrentWeather() {
    fetch(API_URL + `current.json?key=${API_KEY}&q=${current_location}`)
    .then(data => data.json())
    .then(d => {
        t = d.current;
        location_string = d.location.name;
        curr_c = t.temp_c;
        curr_f = t.temp_f;
    })
    .then(setHeader)
    .then(setDeltaWeather);
}

function setDeltaWeather() {
    var d = new Date();
    d.setTime(d.getTime() - 24 * 3600 * 1000);
    var month = d.getUTCMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var yesterday_date = `${d.getUTCFullYear()}-${month}-${d.getUTCDate()}`;
    fetch(API_URL + `history.json?key=${API_KEY}&q=${current_location}&dt=${yesterday_date}`)
    .then(data => data.json())
    .then(d => d.forecast.forecastday[0].day)
    .then(t => {
        
        delta_c = curr_c - t.avgtemp_c;
        delta_f = curr_f - t.avgtemp_f;  
    })
    .then(setContent, false)
    .then(setColor);
}

function setHeader() {
    var d = new Date();
    var time_str = "" + d.toLocaleTimeString().slice(0, -3);
    header.textContent = location_string + "   " + time_str;
}

function setContent(toggle) {
    if (!toggle) {
        delta.textContent = delta_c.toFixed(1) + "°C";
        curr.textContent = `${curr_c} °C`;
    } else {
        delta.textContent = delta_f.toFixed(1) + "°F";
        curr.textContent = `${curr_f} °C`;
    }
    main_row.style.opacity = 1;
    console.log("content set");
}

function setColor() {
    console.log("color is setting");
    if (delta_c < 0) {
        delta.classList.add("cold");
    } else {
        delta.classList.add("warm");
    }
}