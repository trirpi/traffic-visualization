import * as d3 from 'd3';
import * as L from 'leaflet';

let map = L.map('map');
map.setView([51.505, -0.09], 13);

let url = "http://localhost:3000/data"

d3.json(url).then(data => {
    console.log("data", data);
});


