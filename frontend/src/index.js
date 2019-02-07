import * as L from 'leaflet';

let map = L.map('map');

let osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
let osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>';

let osm = new L.TileLayer(osmUrl, {minZoom: 6, maxZoom: 15, attribution: osmAttrib});

map.setView(new L.LatLng(51.0, 4.45),9);
map.addLayer(osm);

let url = 'http://localhost:3000/data';

let markers = [];
let old_markers = [];

function updateMarkers() {
    old_markers = markers;
    markers = [];
    fetch(url)
        .then(response => {
            return response.json();
        }).then(data => {
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
                    color: 'rgb('+r/2+','+g/2+', '+b/2+')',
                    fillColor: 'rgb('+r+','+g+', '+b+')',
                    radius: 1000,
                    fillOpacity: 1,
                }).addTo(map).bindPopup(
                    'location: ' + data[key]['location'] + ', speed: ' + data[key]['speed'] + ', lane: ' + data[key]['lane']
                );
                markers.push(circle);
            }
            old_markers.forEach((marker) => marker.remove());
            old_markers = [];
        }).catch((error) => {
            console.log(error)
        });
};

let updater = setInterval(updateMarkers, 2000);

