import * as d3 from 'd3';
import * as L from 'leaflet';

let map = L.map('map');

let osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
let osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>';

let osm = new L.TileLayer(osmUrl, {minZoom: 6, maxZoom: 15, attribution: osmAttrib});

map.setView(new L.LatLng(51.0, 4.45),8);
map.addLayer(osm);

let url = 'http://localhost:3000/data';

let markers = [];

function updateMarkers() {
    for (var marker in markers) {
        map.removeLayer(marker);
        console.log(marker);
    }
    markers = [];
    d3.json(url).then(data => {

        for (var key in data) {
            let speed = data[key]['speed'];
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

            let circle = L.circle([data[key]['latitude'], data[key]['longitude']], {
                color: 'rgb('+r+','+g+', '+b+')',
                fillColor: 'rgb('+r+','+g+', '+b+')',
                radius: 1000,
            }).addTo(map).bindPopup(
                'location: ' + data[key]['location'] + ', speed: ' + data[key]['speed'] + ', lane: ' + data[key]['lane']

            );
            markers.push(circle);
        }
    });
    console.log(markers);
};

let updater = setInterval(updateMarkers, 2000);

