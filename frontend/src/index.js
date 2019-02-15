import * as L from 'leaflet';

let map = L.map('map');

let osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
let osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>';

let osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 20, attribution: osmAttrib});

map.setView(new L.LatLng(51.0, 4.45),9);
map.addLayer(osm);

let url = 'http://localhost:3000/data';

let markers = [];
let old_markers = [];

function getColor(speed) {
    // get data of blue-orange thingie
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

function updateMarkers(data, old_markers) {
    document.getElementById("title").innerHTML = "Traffic Flanders updated " + data['time'];
    let measure_point_data = data['measure_points'];
    for (var key in measure_point_data) {
        let speed = measure_point_data[key]['speed'];

        let circle = L.circle([measure_point_data[key]['latitude'], measure_point_data[key]['longitude']], {
            color: getFormattedColor(speed),
            fillColor: getDarkFormattedColor(speed),
            radius: 1000,
            fillOpacity: 1,
        }).addTo(map).bindPopup(
            'location: ' + measure_point_data[key]['location'] + ', speed: ' + measure_point_data[key]['speed'] + ', lane: ' + measure_point_data[key]['lane']
        );
        markers.push(circle);
    }
    return old_markers;
}

function update() {
    fetch(url)
        .then(response => {
            return response.json();
        }).then(data => {
            old_markers = markers;
            markers = [];
            console.log("update")
            old_markers = updateMarkers(data, old_markers);
            old_markers.forEach((marker) => marker.remove());
            old_markers = [];
        }).catch((error) => {
            console.log(error)
        });
}

let updater = setInterval(update, 2000);

