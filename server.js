
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

var express = require('express');
var http = require('http');
var url = require('url');
var path = require('path');
var webSocket = require('ws');

var app = express();
var server = http.createServer(app);
var wss = new webSocket.Server({ server:server });

// client connections
var connects = []

app.use((req, res) => res.sendFile(INDEX, { root: __dirname }));

// Called when success building connection
wss.on('connection', function (ws, req) {
  var location = url.parse(req.url, true);

  var initMessage = {message:"connection"};
  ws.send(JSON.stringify(initMessage));
  connects.push(ws);
  console.log("New Client Connected : " + connects.length);

  // Callback from client message
  ws.on('message', function (msg) {
    var parsedMsg = JSON.parse(msg);
    console.log('received raw: %s', msg);
    console.log('received parsed: ', parsedMsg);
    console.log('sending : ', parsedMsg);
    var myIndex = connects.indexOf(ws);
    broadcast(parsedMsg, myIndex);  // Return to client
});

  ws.on('close', function () {
      console.log('A Client Leave');
      connects = connects.filter(function (conn, i) {
          return (conn === ws) ? false : true;
      });
  });

});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

// Implement broadcast function because of ws doesn't have it
function broadcast (message, index) {
  connects.forEach(function (socket, i) {
      console.log('braodcasting : ', JSON.stringify(message));
      if (i != index)
      {
        socket.send(JSON.stringify(message));
      }
  });
}


