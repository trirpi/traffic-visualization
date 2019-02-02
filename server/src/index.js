let d3 = require('d3');
/*
let width = 900;
let height = 600;

let projection = d3.geoEquirectangular();

let svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
let path = d3.geoPath()
    .projection(projection);
let g = svg.append("g");

d3.json("geodata.json", function(error, topology) {
    g.selectAll("path")
        .data(topojson.object(topology, topology.objects.countries).geometries)
    .enter()
      .append("path")
      .attr("d", path)
});*/

var geojson = {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [125.6, 10.1]
  },
  "properties": {
    "name": "Dinagat Islands"
  }
};

var projection = d3.geoEquirectangular();

var geoGenerator = d3.geoPath()
  .projection(projection);

// Join the FeatureCollection's features array to path elements
var u = d3.select('#content g.map')
  .selectAll('path')
  .data(geojson.features);

// Create path elements and update the d attribute using the geo generator
u.enter()
  .append('path')
  .attr('d', geoGenerator);
