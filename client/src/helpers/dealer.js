import Card from './cards';

export default class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            let playerSprite;
            let opponentSprite;
            if (scene.isPlayerA) {
                playerSprite = '14OfSpades';
                opponentSprite = 'cardBack';
            } else {
                playerSprite = '14OfSpades';
                opponentSprite = 'cardBack';
            };
            for (let i = 0; i < 7; i++) {
                let playerCard = new Card(scene);
                playerCard.render(475 + (i * 100), 650, playerSprite);

                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(475 + (i * 100), 125, opponentSprite).disableInteractive());
            }
        }
    }
}
