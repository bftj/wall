var express = require('express');
var bodyParser = require('body-parser');
var expressHbs = require('express3-handlebars');
var socket = require('./socket.js').socket;
var socket_send = require('./socket.js').send;
var onConnection = require('./socket.js').onConnection;


var sockets = express();
var sockets_server = require('http').createServer(sockets);
socket.installHandlers(sockets_server, {prefix: '/socket'});
sockets_server.listen(1338, '0.0.0.0');

var app = express();
var router = express.Router();

app.use(bodyParser.text());

app.set('views', __dirname + '/views');
app.engine('hbs', expressHbs({extname:'hbs'}));
app.set('view engine', 'hbs');

var message = "No messages yet";

router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

router.use(express.static(__dirname + '/static'));

router.get('/', function(req, res) {
  res.render('home', {message: message});
});

var points = {'1':0, '2':0, '3':0, '4':0};

router.post('/', function(req, res) {
  var alternative = req.body;
  if (alternative in points) {
    points[alternative]++;
    socket_send(JSON.stringify(points));
  }
  res.send('Updated!');
});

router.post('/reset/', function(req, res) {
  points = {'1':0, '2':0, '3':0, '4':0};
  socket_send(JSON.stringify(points));
  res.send('Updated!');
});


app.use('/', router);

app.listen(1337);
console.log("It's at port 1337!");

onConnection(function(connection) {
  socket_send(JSON.stringify(points));
});
