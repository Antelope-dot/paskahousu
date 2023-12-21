const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:8080"
    }
});
let players = [];

io.on('connection', function (socket) {
    console.log('User connected: ' + socket.id);

    players.push(socket.id);

    if (players.length === 1) {
        io.emit('isPlayerA');
    }

    socket.on('dealCards', function () {
        io.emit('dealCards');
    });

    socket.on('cardPlayed', function (gameObject, isPlayerA) {
        io.emit('cardPlayed', gameObject, isPlayerA);
    });

    socket.on('disconnect', function() {
        console.log('User disconected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
    });
});

http.listen(3000, function() {
    console.log('Server started!');
});