import * as d3 from 'd3';
import * as topojson from 'topojson-client';

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

let url = "http://localhost:3000/data"

d3.json(url).then(data => {
    console.log("data", data);
});


let url1 = "http://localhost:3000/belgium_data"
d3.json(url1).then(topology => {
    let geojson = topology;
    console.log("geojson", geojson)

    svg.selectAll("path")
        .data(geojson.features)
      .enter().append("path")
        .attr("d", path);
});
