// MAP FUNCTIONALITY

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhcnA5bWVkaWEiLCJhIjoiY2s1YTl0bTVqMGc2djNucGRxdmxuYzRuNiJ9.-5J7mOB7O3RM-lAC3CoLog';

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-103.59179687498357, 40.66995747013945],
    zoom: 1
});

// INFO BUTTON FUNCTIONALITY

let infoSlide = document.querySelector('#overlay');
let infoButton = document.querySelector('#info-icon');

infoButton.addEventListener('click', function () {
    infoSlide.classList.toggle('overlay-transition');
});

// GLOBAL VARIABLES

let form = document.querySelector('#location-form');
let lat = document.querySelector('#latitude');
let long = document.querySelector('#longitude');

// FUNCTION THAT UPDATES MAP

let updateMap = () => {
    let newLong = long.value;
    let newLat = lat.value;
    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [newLong, newLat],
        zoom: 12
    });
    // Marker is added to the new map
    map.on('load', function () {
        map.loadImage(
            'https://upload.wikimedia.org/wikipedia/commons/0/0a/Marker_location.png',
            function (error, image) {
                if (error) throw error;
                map.addImage('cat', image);
                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': [
                                {
                                    'type': 'Feature',
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': [newLong, newLat]
                                    }
                                }
                            ]
                        }
                    },
                    'layout': {
                        'icon-image': 'cat',
                        'icon-size': 1.0
                    }
                });
            }
        );
    });
    return newLat, newLong;
}

// WEATHER FUNCTIONALITY

let temperature = document.querySelector('#temp-text');
let humidity = document.querySelector('#humi-text');
let wind = document.querySelector('#wind-text');
let indexBar = document.querySelector('#index-bar');
let indexLevel = document.querySelector('#index-num');
let msg = document.querySelector('#message');

let getData = () => {
    let weatherLat = lat.value;
    let weatherLong = long.value;

    axios.get(`https://api.weatherbit.io/v2.0/current?&lat=${weatherLat}&lon=${weatherLong}&key=4c652e8ed709497d8dcdf94d980bb425`)
        .then(res => updateWeather(res))
        .catch(err => console.log(err));
}

let celciusToFahrenheit = (a) => {
    let tempConversion = (a * 9 / 5) + 32;
    return Math.round(tempConversion);
}

let kphToMph = (a) => {
    let mph = Math.round(a) / 1.609;
    return Math.round(mph);
}

let updateWeather = (res) => {
    let weatherData = res.data.data[0];
    let tempData = Math.round(weatherData.temp);
    let humData = weatherData.rh;
    let windData = Math.round(weatherData.wind_spd);

    temperature.innerHTML = celciusToFahrenheit(tempData);
    humidity.innerHTML = humData + `%`;
    wind.innerHTML = kphToMph(windData);

    // WILDFIRE INDEX 

    let convertedTemp = celciusToFahrenheit(tempData);

    let calculateTempScore = (t) => {
        if (t < 77) {
            return 25;
        } else if (t < 91 && t > 77) {
            msg.innerHTML = "The risk of a wildfire in your area is moderate.";
            return 50;
        } else if (t < 99 && t > 91) {
            msg.innerHTML = "The risk of a wildfire in your area is high.";
            return 75;
        } else {
            msg.innerHTML = "The risk of a wildfire in your area is extreme.";
            return 100;
        }
    };

    let tempScore = calculateTempScore(convertedTemp);
    console.log(tempScore);

    let calculateHumScore = (h) => {
        if (h < 13) {
            return 100;
        } else if (h < 29 && h > 12) {
            return 75;
        } else if (h < 65 && h > 28) {
            return 50;
        } else {
            return 25;
        }
    };

    let humScore = calculateHumScore(humData);
    console.log(humScore);

    let calculateWindScore = (w) => {
        if (w < 6) {
            return 25;
        } else if (w < 13 && w > 5) {
            return 50;
        } else if (w < 36 && w > 12) {
            return 75;
        } else {
            return 100;
        }
    }

    let windScore = calculateWindScore(windData);
    console.log(windScore);

    let calculateWildfireIndex = (x, y, z) => {
        if (x + y + z <= 149) {
            msg.innerHTML = "The risk of a wildfire in your area is low.";
            indexLevel.innerHTML = "1";
            indexBar.classList = 'index-bar-75';
        } else if (x + y + z <= 224 && x + y + z > 149) {
            msg.innerHTML = "The risk of a wildfire in your area is moderate.";
            indexLevel.innerHTML = "2";
            indexBar.classList = 'index-bar-50';
        } else if (x + y + z <= 274 && x + y + z > 224) {
            msg.innerHTML = "The risk of a wildfire in your area is high.";
            indexLevel.innerHTML = "3";
            indexBar.classList = 'index-bar-25';
        } else {
            msg.innerHTML = "The risk of a wildfire in your area is extreme.";
            indexLevel.innerHTML = "4";
            indexBar.classList = 'index-bar-0';
        }
    }

    calculateWildfireIndex(tempScore, humScore, windScore);
}


// CLICK SUBMIT BUTTON LOADS NEW LOCATION, UPDATES WEATHER, AND PROVIDES INDEX VALUES

let submitForm = (e) => {
    e.preventDefault();
    updateMap();
    getData();
}

document.querySelector('#submit-btn').addEventListener('click', submitForm);

// CLICK RESET BUTTON RESETS LATITUDE AND LONGITUDE FIELDS TO BLANK, LOADS DEFAULT MAP, CLEARS WEATHER, AND CLEARS INDEX VALUES

let resetForm = (e) => {
    e.preventDefault();
    form.reset();
    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [-103.59179687498357, 40.66995747013945],
        zoom: 1
    });

    temperature.innerHTML = "--- ";
    humidity.innerHTML = "---";
    wind.innerHTML = "--- ";
    indexBar.classList.remove('index-bar-0', 'index-bar-25', 'index-bar-50', 'index-bar-75');
    indexLevel.innerHTML = "0";
    msg.innerHTML = "Enter location to calculate the wildfire index."
}

document.querySelector('#reset-btn').addEventListener('click', resetForm);