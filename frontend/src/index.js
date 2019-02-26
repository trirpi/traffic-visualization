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
let oldMarkers = [];

function isToday(date) {
    let today = new Date();
    if (date.toDateString() == today.toDateString()) {
        return true;
    } else {
        return false;
    }
}

function isYesterday(date) {
    let yesterday = (d => new Date(d.setDate(d.getDate()-1)) )(new Date);
    if (date.toDateString() == yesterday.toDateString()) {
        return true;
    } else {
        return false;
    }
}

function getColor(speed) {
    let orangeBlue = document.getElementById('blueorange').checked;
    if (!validMeasurement(speed)) {
        // return black
        return [0,0,0];
    }
    if (!orangeBlue) {
        // return red to green scale, green when fast, red when slow
        let r = (255 * (170-speed)) / 130
        let g = (255 * (speed)) / 130 
        let b = 0
        return [r, g, b];
    } else {
        // return orange to blue scale, blue when fast, orange when slow
        let r = (255 * (130 - speed)) / 130 
        let g = 128 
        let b = (255 * speed) / 130
        return [r, g, b];
    }
}

function getFormattedColor(speed) {
    let colors = getColor(speed);
    return 'rgb('+colors[0]+','+colors[1]+', '+colors[2]+')';
}

function getDarkFormattedColor(speed) {
    let colors = getColor(speed);
    return 'rgb('+colors[0]/2+','+colors[1]/2+', '+colors[2]/2+')';
}

function validMeasurement(speed) {
    if (speed > 0 && speed <= 250) {
        return true;
    }
    return false;
}

function updateMarkers(measurePoints, oldMarkers) {
    oldMarkers = markers;
    markers = [];
    for (var key in measurePoints) {
        let speed = measurePoints[key]['speed'];

        let showUnavailable = document.getElementById('unavailable').checked;

        if (validMeasurement(speed) || showUnavailable) {
            let circle = L.circle([measurePoints[key]['latitude'], measurePoints[key]['longitude']], {
                color: getFormattedColor(speed),
                fillColor: getDarkFormattedColor(speed),
                radius: 10000/(map.getZoom()), // this should get smaller when zooming in
                fillOpacity: 1,
            }).addTo(map).bindPopup(
                'location: ' + measurePoints[key]['location'] + ', speed: ' + measurePoints[key]['speed'] + ', lane: ' + measurePoints[key]['lane']
            );
            markers.push(circle);
        }
    }
    oldMarkers.forEach((marker) => marker.remove());
    oldMarkers = [];
}

function updateData(url) {
    fetch(url).then(response => {
        return response.json();
    }).then(response => {
        let date = new Date(response['data']['time'])
        document.getElementById('updated').innerHTML = 'updated ' + date.toUTCString();

        updateMarkers(response['data']['measure_points'], oldMarkers);
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
    updateLegend();
    updateHistoryTable();
}


function updateHistoryTable() {
    fetch(api_url + '/data_available').then(response => {
        return response.json();
    }).then(response => {
        let available = response['available'];
        // update history tab
        let today_ul = document.getElementById('today');
        let yesterday_ul = document.getElementById('yesterday');
        // remove old
        while (today_ul.firstChild) {
            today_ul.removeChild(today_ul.firstChild);
        }
        while (yesterday_ul.firstChild) {
            yesterday_ul.removeChild(yesterday_ul.firstChild);
        }
        // append new ones
        available.forEach(filename => {
            let date = new Date(filename.substring(0,filename.length -5));
            if (isToday(date)) {
                addHistoryButton(today_ul, date, filename);
            } else if (isYesterday(date)) {
                addHistoryButton(yesterday_ul, date, filename);
            }
        });
        document.getElementById('history');
    });
}


function addHistoryButton(parent_element, date, filename) {
    let button = document.createElement('input');
    button.type = 'button';
    button.value = date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
    button.addEventListener('click', () => changeViewFile(filename));

    let li = document.createElement('li');
    li.appendChild(button);
    parent_element.appendChild(li);

}


function changeViewFile(filename) {
    viewFile = filename; // global var, cleanup pls
    updateData(api_url + '/data/' + viewFile);
}

function updateLegend() {
    let legend0 = document.getElementById('legend0');
    legend0.style.backgroundColor = getFormattedColor(10);
    let legend1 = document.getElementById('legend1');
    legend1.style.backgroundColor = getFormattedColor(40);
    let legend2 = document.getElementById('legend2');
    legend2.style.backgroundColor = getFormattedColor(70);
    let legend3 = document.getElementById('legend3');
    legend3.style.backgroundColor = getFormattedColor(100);
    let legend4 = document.getElementById('legend4');
    legend4.style.backgroundColor = getFormattedColor(130);
}



// program updates every 5 seconds
updateAll();
let checkmarkBlueorange = document.getElementById('blueorange');
let checkmarkUnavailable = document.getElementById('unavailable');
checkmarkBlueorange.onchange= () => updateAll();
checkmarkUnavailable.onchange= () => updateAll();

let updater = setInterval(updateAll, 5000);

