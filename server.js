const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http, {
    cors: {
        origin: ["http://localhost:8080", "http://localhost:8081"]
    }
});
let players = [];
let colors = ["Hearts", "Diamonds", "Spades", "Clubs"];
let deck = [];


function initDeck() {
    deck = [];
    for (let i = 2;  i <= 14; i++){
        for (let color of colors) {
            deck.push(`${i}Of${color}`);
        }
    }

    //Fisher-Yates shuffle to randomize deck
    let currentIndex = deck.length,  randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [deck[currentIndex], deck[randomIndex]] = [
        deck[randomIndex], deck[currentIndex]];
    }
}



io.on('connection', function (socket) {
    console.log('User connected: ' + socket.id);

    players.push(socket.id);

    if (players.length === 1) {
        io.emit('isPlayerA');
    }
    if (players.length === 2) {
        initDeck();
    }

    socket.on('dealCards', function (isPlayerA) {
        let playerACards = [];
        let playerBCards = [];
        for (let i = 0; i < 5; i++) {
            playerACards.push(deck.pop());
            playerBCards.push(deck.pop());
        }
        io.emit('dealCards', playerACards, playerBCards, isPlayerA);
    });

    socket.on('cardPlayed', function (gameObject, cardValue, isPlayerA) {
        io.emit('cardPlayed', gameObject, cardValue, isPlayerA);
    });

    socket.on('disconnect', function() {
        console.log('User disconected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
    });
});

http.listen(3000, function() {
    console.log('Server started!');
});
