#!/usr/bin/env nodejs

'use strict';

let express = require('express');
let app = express();
let fs = require('fs');
let server = require('http').Server(app);
let config = require(__dirname + '/config');


server.listen(config.port);


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


app.get('/data', (req, res) => {
    fs.readFile(__dirname + '/scraper/most_recent_data.json', 'utf8', (err, data) => {
        try {
            let json_data = JSON.parse(data);
            return res.json({
                'status': 'success',
                'message': 'data retrieved successfully',
                'data': json_data
            });
        } catch (error) {
            return res.status(404).json({
                'status': 'error',
                'message': 'file does not exist'
            });
        }
    });
});


app.get('/data_available', (req, res) => {
    let old_data_dir = __dirname + '/scraper/old_data';
    try {
        let files = [];
        fs.readdirSync(old_data_dir).forEach(file => {
            if (file.match(new RegExp(/.*.json/g))) {
                files.push(file);
            }
        });
        return res.json({
            'status': 'success',
            'message': 'available files retrieved successfully',
            'available': files
        });
    } catch (error) { // error shoulb be changed
        return res.status(500).json({
            'status': 'error',
            'message': error.message
        });
    }
});


app.get('/data/:filename', (req, res) => {
    fs.readFile(__dirname + '/scraper/old_data/' + req.params.filename, 'utf8', (err, data) => {
        try {
            let json_data = JSON.parse(data);
            return res.json({
                'status': 'success',
                'message': 'file retrieved successfully',
                'data': json_data
            });
        } catch (error) {
            return res.status(500).json({
                'status': 'error',
                'message': error.message
            });
        }
    });
});


console.log('[*] Info: Running on http://' + config.server + ':' + config.port.toString());

