const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

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
  
server.listen(3000, () => {
  console.log('listening on *:3000');
});