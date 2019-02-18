import * as L from 'leaflet';

// API url
let api_url = 'http://localhost:3000';

// Map settings
let map = L.map('map');
let osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
let osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>';
let osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 20, attribution: osmAttrib});
map.setView(new L.LatLng(51.0, 4.45),9);
map.addLayer(osm);

// string which indicates which data we are viewing, e.g. '2019-02-16T11:10:22.319138.json' or 'current'
let viewFile = 'current';

let markers = [];
let old_markers = [];

function isToday(date) {
    let today = new Date();
    if (date.toDateString() == today.toDateString()) {
        return true;
    } else {
        return false;
    }
}

function isYesterday(date) {
    let today = new Date();
    let yesterday = today.setDate(today.getDate() - 1);
    if (date.toDateString() == yesterday.toDateString()) {
        return true;
    } else {
        return false;
    }
}

function getColor(speed) {
    // TODO: get data of blue-orange checkmark here
    let r = 0;
    let g = 0;
    let b = 255;
    if (speed > 0 && speed <= 250) {
        if (speed > 85) {
            r = 0;
            g = 255;
            b = 0;
        } else {
            r = 255;
            g = speed*2;
            b = 0;
        }
    }
    return [r, g, b];
}

function getFormattedColor(speed) {
    let colors = getColor(speed);
    return 'rgb('+colors[0]+','+colors[1]+', '+colors[2]+')';
}

function getDarkFormattedColor(speed) {
    let colors = getColor(speed);
    return 'rgb('+colors[0]/2+','+colors[1]/2+', '+colors[2]/2+')';
}

function updateMarkers(measure_points, old_markers) {
    old_markers = markers;
    markers = [];
    for (var key in measure_points) {
        let speed = measure_points[key]['speed'];

        let circle = L.circle([measure_points[key]['latitude'], measure_points[key]['longitude']], {
            color: getFormattedColor(speed),
            fillColor: getDarkFormattedColor(speed),
            radius: 1000,
            fillOpacity: 1,
        }).addTo(map).bindPopup(
            'location: ' + measure_points[key]['location'] + ', speed: ' + measure_points[key]['speed'] + ', lane: ' + measure_points[key]['lane']
        );
        markers.push(circle);
    }
    old_markers.forEach((marker) => marker.remove());
    old_markers = [];
}

function updateData(url) {
    fetch(url).then(response => {
        return response.json();
    }).then(response => {
        let date = new Date(response['data']['time'])
        document.getElementById('title').innerHTML = 'Traffic Flanders updated ' + date.toLocaleString();

        updateMarkers(response['data']['measure_points'], old_markers);
    }).catch((error) => {
        console.log(error)
    });
}


function updateAll() {
    if (viewFile == 'current') {
        updateData(api_url + '/data')
    } else {
        updateData(api_url + '/data/' + viewFile);
    }
    updateHistoryTable()
}


function updateHistoryTable() {
    fetch(api_url + '/data_available').then(response => {
        return response.json();
    }).then(response => {
        let available = response['available'];
        // update history tab
        let ul = document.getElementById('history');
        // remove old
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild );
        }
        // append new ones
        available.forEach(filename => {
            let button = document.createElement('input');
            button.type = 'button';
            button.value = new Date(filename.substring(0,filename.length -5)).toLocaleTimeString();
            button.addEventListener('click', () => changeViewFile(filename));

            let li = document.createElement('li');
            li.appendChild(button);
            ul.appendChild(li);
        });
        document.getElementById('history')
    });
}


function changeViewFile(filename) {
    viewFile = filename; // global var, cleanup pls
    updateData(api_url + '/data/' + viewFile);
}

// program updates every 5 seconds
updateAll();
let updater = setInterval(updateAll(), 5000);

