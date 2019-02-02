import * as d3 from 'd3';

let geojson = {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [125.6, 10.1]
  },
  "properties": {
    "name": "Dinagat Islands"
  }
};


let width = 960;
let height = 500;

let projection = d3.geoMercator();
  
let path = d3.geoPath()
    .projection(projection)

let svg = d3.select("#content").append("svg")
   .attr("width", width)
   .attr("height", height);

console.log("ok");

