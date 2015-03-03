var sock = require('sockjs');

var echo = sock.createServer();

connections = {};

echo.on('connection', function (conn) {
  connections[conn.id] = conn;
  console.log('connection!');
  for (var i=0; i < callbacks.length; i++) {
    callbacks[i](conn);
  }

  conn.on('close', function () {
    delete connections[conn.id];
    console.log('lost connection');
  });
});

function send(message) {
  for (var conn_id in connections) {
    connections[conn_id].write(message);
  }
}

var callbacks = [];

function onConnection(callback) {
  callbacks.push(callback);
}

module.exports = {socket: echo, send: send, onConnection: onConnection};
