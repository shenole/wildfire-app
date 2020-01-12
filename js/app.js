mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhcnA5bWVkaWEiLCJhIjoiY2s1YTl0bTVqMGc2djNucGRxdmxuYzRuNiJ9.-5J7mOB7O3RM-lAC3CoLog';
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-103.59179687498357, 40.66995747013945],
    zoom: 1
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
}

// CLICK SUBMIT BUTTON LOADS NEW LOCATION, UPDATES WEATHER, AND PROVIDES INDEX VALUES

let submitForm = (e) => {
    e.preventDefault();
    updateMap();
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
}

document.querySelector('#reset-btn').addEventListener('click', resetForm);