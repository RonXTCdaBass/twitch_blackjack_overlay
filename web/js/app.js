import { client } from './twitch.js';
import { channel } from './twitch.js';

let blackjackGame = 
{
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A',],
    'cardMap': {'2' : 2, '3' : 3, '4' : 4, '5' : 5, '6' : 6, '7' : 7, '8' : 8, '9' : 9, '10' : 10, 'J' : 10, 'Q' : 10, 'K' : 10, 'A' : [1,11]}, 
	'isStand': false,
    'isTurnOver': false,
}

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const userElement = document.querySelector('#user');

const divElem = document.getElementById('game-container');
const overlayElem = document.getElementById('game-overlay');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', blackjackStand);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);


/* POPUP-SHOW */
function showPopup() {
var contentElem = document.getElementById('game-content');
overlayElem.style.visibility = "visible"; // show 
divElem.style.visibility = "visible"; // show  
}

/* POPUP-HIDE */
function hidePopup() {
    if(document.getElementById) {
        var divElem = document.getElementById('game-container');
		var overlayElem = document.getElementById('game-overlay');
divElem.style.visibility = "hidden"; // hide 
overlayElem.style.visibility = "hidden"; // hide
} 
}
/* POPUP Ende */


client.connect().then(() => {
  userElement.textContent = `You`;
});

let listeningForPlay = false;
let user = {};
	
client.on('message', (name, tags, message, self) => {
	console.log(`${tags['display-name']}: ${message}`);
	if(self || !message.startsWith('!')) return;

	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();
			
		const { username } = tags;	
		if (Object.keys(user) == '') {
		if (command === "jack") { // It let a player join the game
		listeningForPlay = true;
		user[tags.username] = true;
	showPopup();  // display current name.
		userElement.textContent = Object.keys(user);  // set the name of the player
		}}
			if (listeningForPlay == true && command === "hit") { // draw a card
			if (Object.keys(user) == username) {  // only the user who opened the round can play
				user[tags.username] = true;
			blackjackHit();
			}}
			if (listeningForPlay == true && command === "stand") { // stand
			if (Object.keys(user) == username) {  // only the user who opened the round can play
				user[tags.username] = true;
			blackjackStand();
			}}
			if (listeningForPlay == true && command === "deal") { // deal - end of the round
			if (Object.keys(user) == username) {  // only the user who opened the round can play
				user[tags.username] = true;
			blackjackDeal();
			listeningForPlay = false;
			clear();
			}	}
		if(command === 'echo') {  // only used for testing if your bot connectet 
			client.say(channel, `@${tags.display-name}, you said: "${args.join(' ')}"`);
			}
		});

function blackjackHit()
{
    let card = randomCard();
    if(blackjackGame['isStand'] === false)
    {
		showCard(YOU, card);
        updateScore(YOU, card);
        showScore(YOU);
    }
}

function blackjackStand()
{
    dealerLogic();
}

function blackjackDeal()
{
    if(blackjackGame['isTurnOver'])
    {
        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    
        for(var i = 0; i < dealerImages.length; i++)
        {
            dealerImages[i].remove();
        }
    
        for(var i = 0; i < yourImages.length; i++)
        {
            yourImages[i].remove();
        }
    
        YOU['score'] = 0;
        document.querySelector(YOU['scoreSpan']).textContent = YOU['score'];
        document.querySelector(YOU['scoreSpan']).style.color = 'white';
    
        DEALER['score'] = 0;
        document.querySelector(DEALER['scoreSpan']).textContent = DEALER['score'];
        document.querySelector(DEALER['scoreSpan']).style.color = 'white';
    
        document.querySelector('#blackjack-result').textContent = 'Blackjack';
        document.querySelector('#blackjack-result').style.color = 'white';

        blackjackGame['isTurnOver'] = true;
		clear();
		hidePopup();
    }
}

function showCard(activePlayer, card)
{
    if(activePlayer['score'] <= 21)
    {
        let cardImage = document.createElement('img');
        cardImage.src = 'img/' + card + '.png'
        document.querySelector(activePlayer['div']).appendChild(cardImage);
    }
}
	
function randomCard()
{
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function updateScore(activePlayer, card)
{
    if(activePlayer['score'] <= 21)
    {
        if(card === 'A')
        {
            if(activePlayer['score'] + blackjackGame['cardMap'][card][1] <= 21)
            {
                activePlayer['score'] += blackjackGame['cardMap'][card][1];
            }
            else
            {
                activePlayer['score'] += blackjackGame['cardMap'][card][0];
            }
        }
        else
        {
            activePlayer['score'] += blackjackGame['cardMap'][card];
        }
    }
}

function showScore(activePlayer)
{
    if(activePlayer['score'] > 21)
    {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
        console.log(activePlayer['score']);
		
		blackjackGame['isTurnOver'] = true;
		!blackjackStand();
    }
    else
    {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

async function dealerLogic()
{
    blackjackGame['isStand'] = true;

    while(DEALER['score'] <= 16 && blackjackGame['isStand'] && YOU['score'] > 0)
    {
        let card = randomCard();
        showCard(DEALER, card);
        updateScore(DEALER, card);
        showScore(DEALER);
        await sleep(500);
    }

    blackjackGame['isTurnOver'] = true;
    computeWinner();
}

function computeWinner()
{
    let result = document.querySelector('#blackjack-result');
    
    if(blackjackGame['isTurnOver'])
    {
		
        if(YOU['score'] <= 21 && DEALER['score'] <= 21)
        {
            if(YOU['score'] < DEALER['score'])  loss(result);
    
            else if(YOU['score'] > DEALER['score']) win(result);
    
            else draw(result);

        }
    
        else if(YOU['score'] > 21)
        {
            if(DEALER['score'] < 21 && DEALER['score'] > 0) loss(result);
    
            else draw(result);

        }
    
        else
        {
            if(YOU['score'] < 21 && YOU['score'] > 0) win(result);
    
            else draw(result);

        } 
		countdown();
    }
}

function win(res)
{
    let wins = document.querySelector('#wins');

    res.textContent = 'YOU WIN!';
    res.style.color = 'green';
	client.say(channel, `You win! HSWP `);
}

function loss(res)
{
    let losses = document.querySelector('#losses');

    res.textContent = 'YOU LOSE!';
    res.style.color = 'red';
	client.say(channel, `You lose! NotLikeThis `);
}

function draw(res)
{
    let draws = document.querySelector('#draws');

    res.textContent = 'DRAW!';
    res.style.color = 'yellow';
	client.say(channel, `Try again!`);
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function countdown() {
let remainingTimeElement = document.querySelector("#remainingTime"),
             secondsLeft = 10

const Timer = setInterval( 
    () => {
        if (secondsLeft <= 0) {
            clearInterval(Timer)
            remainingTime.style.display = "None"
			blackjackDeal();
        }
        remainingTimeElement.value = secondsLeft
        remainingTimeElement.textContent = secondsLeft
        secondsLeft -= 1
    }, 
1000)
}

function clear() {
	userElement.textContent = 'You';
      user = {};
    }
	

// reloads with chat /clear is used
function clearChat(channel) {
    setTimeout(function () {
        window.location.reload(true);
    }, 1000);
}
client.addListener('clearchat', clearChat);