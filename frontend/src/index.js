import * as d3 from 'd3';
import * as L from 'leaflet';

let map = L.map('map');

let osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
let osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>';

let osm = new L.TileLayer(osmUrl, {minZoom: 6, maxZoom: 10, attribution: osmAttrib});		

map.setView(new L.LatLng(51.0, 4.45),8);
map.addLayer(osm);

let url = 'http://localhost:3000/data';

d3.json(url).then(data => {
    for (var key in data) {
        var circle = L.circle([data[key]['latitude'], data[key]['longitude']], {
            color: 'red',
            fillColor: '#f03',
            radius: 10
        }).addTo(map);
    }
});


