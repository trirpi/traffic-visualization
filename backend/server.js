let express = require('express');
let app = express();
let fs = require('fs');
let server = require('http').Server(app);

let config = require(__dirname + '/config');


server.listen(config.port);

app.get('/data', function (req, res) {
    fs.readFile(__dirname + '/data.json', 'utf8', (err, data) => {
         res.end(data);
      });
});

console.log('[*] Info: Running on http://' + config.server + ':' + config.port.toString());