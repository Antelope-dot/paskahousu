import Card from './cards';

export default class Dealer {
    constructor(scene) {
        this.dealCards = (cards) => {

            let opponentSprite = 'cardBack';
            for (let i = 0; i < 5; i++) {
                let playerSprite;
                playerSprite = cards.pop();
                let playerCard = new Card(scene);
                playerCard.render(475 + (i * 100), 650, playerSprite);

                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(475 + (i * 100), 125, opponentSprite).disableInteractive());
            }
        }
    }
}
