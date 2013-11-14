var WebSocketServer = require('ws').Server,
    http = require('http'),
    express = require('express'),
    fs = require('fs'),
    process = require('process'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config')[env],
    mongoose = require('mongoose'),
    path = require('path'),
    request = require('request'),
    // amqp = require('./amqp'),
    pm = require('pagemunch');

//File server ralated initializations
var static = require('node-static');
var fileServer = new static.Server('./');
var FILE_PORT = process.env.FILE_PORT || 5000;

http.createServer(function(request, response) {
    request.addListener('end', function() {
        console.log(request.url);
        fileServer.serve(request, response);
    }).resume();
}).listen(FILE_PORT);

console.log('File Server started on %s', FILE_PORT);



// pagemunch api key
pm.set({
    key: '477eab6e9740bf59ed932bc94d299cc1'
});

// bootstrap db connection
console.log("db path %s", config.db);
mongoose.connect(config.db);

var models_path = __dirname + '/models';
fs.readdirSync(models_path).forEach(function(file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
});

var Classroom = mongoose.model('Classroom');
var Article = mongoose.model('Article');


var app = module.exports = express();


/**
 * Express Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/'));


// development only
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
    // TODO
};


/**
 * Routes
 */

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Origin, Accept, Authorization, x-csrf-token');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method.toLowerCase() === 'options') {
        res.send(200);
    } else {
        next();
    }
});

app.get('/', function(req, res, next) {
    res.send(501);
});


/* sample get
app.get('/classrooms', function(req, res, next) {

    // amqp.send('doca message 2');
    Classroom.find({}, function(error, classrooms) {
        if (error) {
            res.send(error, 500);
        } else {
            res.send(classrooms, 200);
        }
    });

});


Sample put
app.put('/classrooms', function(req, res, next) {

    var croom = new Classroom({
        name: req.body.name
    });

    croom.save(function(err, saved) {
        if (err)
            res.send(500, err);
        else
            res.send(200, saved);
    });

});



app.del('/classrooms/:classroomId/articles/:articleId', function(req, res, next) {
    Article.remove({
        classroom: classroomId,
        _id: articleId
    }, function(err) {
        if (err)
            res.send(500, err);
        else
            res.send(200);
    })

    res.send(501);
});

*/



/**
 * Start Server
 */
var httpserver = http.createServer(app);
httpserver.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
    console.log('Loaded config: ' + app.get('env'));    
});

//start websocket server
var wss = new WebSocketServer({
    server: httpserver
});

console.log('websocket server created');

wss.on('connection', function(ws) {

        console.log("websocket connection started");

        // hash of the article url should come in "url"
        //amqp.initializeConsumer(indexContent, ws, ws.upgradeReq.url);

        console.log('websocket connection open');

        ws.on('close', function() {
            console.log('websocket connection close');

        });
    }

);