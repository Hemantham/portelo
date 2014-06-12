'use strict';

var http = require('http'),
    express = require('express'),
    fs = require('fs'),
    process = require('process'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config')[env],
   // mongoose = require('mongoose'),
    path = require('path'),
    request = require('request');


// bootstrap db connection
//console.log("db path %s", config.db);
//mongoose.connect(config.db);

var models_path = __dirname + '/models';
fs.readdirSync(models_path).forEach(function(file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
});

var app = module.exports = express();


/**
 * Express Configuration
 */

// all environments
app.set('port', process.env.PORT || 3010);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/app/'));


// development only
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
    // TODO
}
    
// 
app.post('/api/proxy', function (req, res, next) {
    console.log('body: ' + req.body);

    var token = req.body.token;
    var url = req.body.url;

    console.log(token);
    console.log(url);

    // if(req.body.method != 'GET') 
    //     res.send(501);

    request.get(url, {
        headers: {
            "X-Authorization": "Access_Token access_token=" + token
        }
    }, function (e, r, body) {
        console.log('error: %s', e);
        console.log('response: %s', r);
        console.log('body: %s', JSON.stringify(body));
        res.send(body);
    });
});

app.get('/status', function (req, res, next) {
    res.send(200);
})

/**
 * Start Server
 */
var httpserver = http.createServer(app);

httpserver.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
    console.log('Loaded config: ' + app.get('env'));
});