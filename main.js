const API_URL = "http://api.apixu.com/v1/";
const API_KEY = "5ab92edabc6c433188065649183110";

var deltac = document.querySelector(".deltac");
var deltaf = document.querySelector(".deltaf");
var currc = document.querySelector(".currc");
var currf = document.querySelector(".currf");
var main_row = document.querySelector(".main-row");
var header = document.querySelector(".header");

var current_location;
var location_string;

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
        currc.textContent = `${t.temp_c} °C`;
        currf.textContent = `${t.temp_f} °F`;
    })
    .then(setHeader)
    .then(setDeltaWeather);
}

function setDeltaWeather() {
    var d = new Date();
    var month = d.getUTCMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var yesterday_date = `${d.getUTCFullYear()}-${month}-${d.getUTCDate()}`;
    fetch(API_URL + `history.json?key=${API_KEY}&q=${current_location}&dt=${yesterday_date}`)
    .then(data => data.json())
    .then(d => d.forecast.forecastday[0].day)
    .then(t => {
        curr_c = parseFloat(currc.textContent.slice(0, -3));
        deltac.textContent = `${(curr_c - t.avgtemp_c).toFixed(1)} °C`;

        console.log(t);
        curr_f = parseFloat(currf.textContent.slice(0, -3));
        console.log(curr_f);
        deltaf.textContent = `${(curr_f - t.avgtemp_f).toFixed(1)} °F`;
    })
    .then(e => { main_row.style.display = "block"; });
}

function setHeader() {
    var d = new Date();
    var time_str = "" + d.toLocaleTimeString().slice(0, -3);
    header.textContent = location_string + "   " + time_str;
}

