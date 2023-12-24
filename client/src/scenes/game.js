import io from 'socket.io-client';
import Card from '../helpers/cards';
import Dealer from "../helpers/dealer";
import Zone from '../helpers/zone';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        let colors = ["Hearts", "Diamonds", "Spades", "Clubs"]
        //way this goes is: "number_of_color.png"
        for (let i = 2;  i <= 14; i++) {
            for (let color of colors) {
                this.load.image(`${i}Of${color}`, `assets/cards/${i}_of_${color.toLocaleLowerCase()}.png`)
            }
        }
        //this.load.image('aceOfSpades', 'assets/cards/ace_of_spades.png');
        this.load.image('cardBack', 'assets/card_back.png');
    }

    create() {
        this.isPlayerA = false;
        this.opponentCards = [];

        this.currentCardValue = this.add.text(75, 400, "CURRENT VALUE: ", {fontSize: '16px', fill: '#fff'});
        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        this.dealer = new Dealer(this);

        let self = this;

        this.socket = io('http://localhost:3000');

        this.socket.on('connect', function () {
            console.log('Connected!');
        });

        this.socket.on('isPlayerA', function () {
            self.isPlayerA = true;
        })

        this.socket.on('dealCards', function (playerACards, playerBCards, isPlayerA) {
            if (self.isPlayerA) {
                self.dealer.dealCards(playerBCards);
                self.dealText.disableInteractive();
            } else {
                self.dealer.dealCards(playerACards);
                self.dealText.disableInteractive();
            }
        })

        this.socket.on('cardPlayed', function (gameObject, cardValue, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = 'cardBack';
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards++;
                let card = new Card(self);
                card.render((self.dropZone.x), (self.dropZone.y), sprite).disableInteractive();
            }
            self.currentCardValue.setText('CURRENT VALUE ' + cardValue);
        })

        this.dealText = this.add.text(75, 350, ['DEAL CARDS']).setFontSize(18).setFontFamily('"Press Start 2P"').setColor('White').setInteractive();


        this.dealText.on('pointerdown', function () {
            self.socket.emit("dealCards", self.isPlayerA);
        })

        this.dealText.on('pointerover', function () {
            self.dealText.setColor('Red');
        })

        this.dealText.on('pointerout', function () {
            self.dealText.setColor('White');
        })

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        this.input.on('dragstart', function (pointer, gameObject) {
            self.children.bringToTop(gameObject);
        })

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            let cardValue = gameObject.texture.key.substring(0, gameObject.texture.key.indexOf('O'));
            dropZone.data.values.cards++;
            gameObject.x = (dropZone.x);
            gameObject.y = dropZone.y;
            gameObject.disableInteractive();
            self.socket.emit('cardPlayed', gameObject, cardValue, self.isPlayerA);
        })
    }

    update() {

    }
}
