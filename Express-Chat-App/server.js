const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


const io = require('socket.io')(server);
const users = {};

io.on('connection', (socket) => {

    socket.on('new-user-joined', (name) => {
        console.log('New User: ', name);
        users[socket.id] = name;
        socket.emit('connectMe',name);
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (data) => {
        socket.broadcast.emit('receive', data);
    });

    socket.on('disconnect', () => {
        console.log('User Left: ', users[socket.id]);
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

});