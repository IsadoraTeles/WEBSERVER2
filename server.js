
// NODE SOCKET.IO

'use strict';

var fs = require('fs');
var https = require('https');

const express = require('express');
var app = express();

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

var server = https.createServer(options, app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
  });

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

//////////////////

io.on('connection', (socket) => 
{
	console.log('new connection from:',	socket.id);
	socket.on('accelerometer', accelerometerMsg);
	socket.on('mouse', mouseMsg);
	function accelerometerMsg(data) 
	{
		socket.broadcast.emit('accelerometer', data);
		console.log(data);
	}
	function mouseMsg(data) 
	{
		socket.broadcast.emit('mouse', data);
		// console.log(data);
	}
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);