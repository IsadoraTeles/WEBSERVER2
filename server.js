const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => 
{
    console.log(`Our app is running on port ${ PORT }`);
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => 
{
    console.log('a user connected');

    socket.on('mobileData', (msg) => 
    {
        console.log('message: ' + msg);
        socket.broadcast.emit('mobileData', msg);
    });

    socket.on('disconnect', () => 
    {
        console.log('user disconnected');
    });
});
  
