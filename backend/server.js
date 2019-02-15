#!/usr/bin/env nodejs

"use strict";

let express = require('express');
let app = express();
let fs = require('fs');
let server = require('http').Server(app);

let config = require(__dirname + '/config');

let old_data = __dirname + '/scraper/old_data'


server.listen(config.port);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/data', (req, res) => {
    fs.readFile(__dirname + '/scraper/most_recent_data.json', 'utf8', (err, data) => {
         res.json(JSON.parse(data));
    });
});

app.get('/data_available', (req, res) => {
    let old_data_dir = __dirname + '/scraper/old_data';
    let files = fs.readdirSync(old_data_dir);
    res.json({
        "av": files
    });
});

app.get('/data/:time', (req, res) => {
    console.log(req.params.time);
    res.end(req.params.time);
});

console.log('[*] Info: Running on http://' + config.server + ':' + config.port.toString());

