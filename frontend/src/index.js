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

var url = "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json"
d3.json(url, function(error, topology) {
    if (error) {
        console.log(error);
    }

  console.log("topojson", topology)
  var geojson = topojson.feature(topology, topology.objects.counties);
  console.log("geojson", geojson)
});

console.log("ok");
