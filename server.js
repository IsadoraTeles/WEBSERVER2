// 'use strict';

// const express = require('express');
// const http = require('http');
// var https = require('https');
// var fs = require( 'fs' );
// const path = require('path');
// const { Server } = require("socket.io");

// const PORT = process.env.PORT || 3000;
// const INDEX = '/index.html';

// const options = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
//   };

// const app = express();
// const server = https.createServer(options, app);

// app.use(express.static(__dirname + '/public'));

// app.get('/', (req, res) => {
//     res.sendFile(INDEX, { root: __dirname });
//   });

// server.listen(PORT, () => {
//     console.log(`Listening on ${ PORT }`);
//   });

// const io = new Server(server);

///////////////////////////////////

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
		//console.log(data);
	}
	function mouseMsg(data) 
	{
		socket.broadcast.emit('mouse', data);
		// console.log(data);
	}
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);