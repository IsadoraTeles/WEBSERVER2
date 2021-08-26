
// NODE SOCKET.IO

'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use(express.static(__dirname + '/public'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

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
		console.log(data);
	}
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);