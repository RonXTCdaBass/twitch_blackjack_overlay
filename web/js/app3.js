import { client } from './obfuscated.js';
import { channel } from './obfuscated.js';

let blackjackGame = 
{
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['d2','h2','s2','c2', 'd3','h3','s3','c3', 'd4','h4','s4','c4', 'd5','h5','s5','c5', 'd6','h6','s6','c6', 'd7','h7','s7','c7', 'd8','h8','s8','c8', 'd9','h9','s9','c9', 'd10','h10','s10','c10', 'dj','hj','sj','cj', 'dq','hq','sq','cq', 'dk','hk','sk','ck', 'dA','hA','sA','cA'],
    'cardMap': {'d2': 2,'h2': 2,'s2': 2,'c2' : 2, 'd3': 3,'h3': 3,'s3': 3,'c3' : 3, 'd4': 4,'h4': 4,'s4': 4,'c4' : 4, 'd5': 5,'h5': 5,'s5': 5,'c5' : 5, 'd6': 6,'h6': 6,'s6': 6,'c6' : 6, 'd7': 7,'h7': 7,'s7': 7,'c7' : 7, 'd8': 8,'h8': 8,'s8': 8,'c8' : 8, 'd9': 9,'h9': 9,'s9': 9,'c9' : 9, 'd10': 10,'h10': 10,'s10': 10,'c10' : 10, 'dj': 10,'hj': 10,'sj': 10,'cj' : 10, 'dq': 10,'hq': 10,'sq': 10,'cq' : 10, 'dk': 10,'hk': 10,'sk': 10,'ck' : 10, 'dA': 11, 'hA': 11, 'sA': 11, 'cA' : 11}, 
	'isStand': false,
    'isTurnOver': false,
}

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const usersElement = document.querySelector('#users');

const divElem = document.getElementById('game-container');
const overlayElem = document.getElementById('game-overlay');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', blackjackStand);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);


/* POPUP-GAME-SHOW */
function showPopup() {
var contentElem = document.getElementById('game-content');
overlayElem.style.visibility = "visible"; // show  .style.display = 'block';
divElem.style.visibility = "visible"; // show  .style.display = 'block';
}

/* POPUP-GAME-HIDE */
function hidePopup() {
    if(document.getElementById) {
        var divElem = document.getElementById('game-container');
		var overlayElem = document.getElementById('game-overlay');
divElem.style.visibility = "hidden"; // hide "hidden"
overlayElem.style.visibility = "hidden"; // hide
// document.getElementById(id).style.visibility = "visible"; // show 
} 
}
/* POPUP-GAME Ende */


client.connect().then(() => {
  usersElement.textContent = `You`;
});

let listeningForPlay = false;
let users = {};
	
client.on('message', (name, tags, message, self) => {
	console.log(`${tags['display-name']}: ${message}`);
	if(self || !message.startsWith('!')) return;

	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();
			
		const { username } = tags;	
		if (Object.keys(users) == '') {
		if (command === "jack") { // If its the first round let a player join the game
		listeningForPlay = true;
		users[tags.username] = true;
	showPopup();
		// display current name.
		usersElement.textContent = Object.keys(users);
		}}
			if (listeningForPlay == true && command === "hit") { // give card
			if (Object.keys(users) == username) {
				users[tags.username] = true;
			blackjackHit();
			}}
			if (listeningForPlay == true && command === "stand") { // Holding
			if (Object.keys(users) == username) {
				users[tags.username] = true;
			blackjackStand();
			}}
			if (listeningForPlay == true && command === "deal") { // show
			if (Object.keys(users) == username) {
				users[tags.username] = true;
			blackjackDeal();
			listeningForPlay = false;
			clear();

			}	}
			
		if (username.toLowerCase() === channel.toLowerCase()) {   // caster can end round
				if (message === '!deal') {
				users[tags.username] = true;
					blackjackDeal();
					listeningForPlay = false;
					clear();
					location.reload(); 
				}
			}	
			
		if(command === 'echo') {
			client.say(channel, `@${tags['display-name']}, you said: "${args.join(' ')}"`);
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
        cardImage.src = 'fullcards/' + card + '.png'
        document.querySelector(activePlayer['div']).appendChild(cardImage);
    }
}
	
function randomCard()
{
    let randomIndex = Math.floor(Math.random() * 52);
    return blackjackGame['cards'][randomIndex];
}

function updateScore(activePlayer, card)
{
    if(activePlayer['score'] <= 21)
    {
        if(card === ['dA'||'hA'||'sA'||'cA'])
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
	// client.say(channel, `@${tags['display-name']}, You win! HSWP  + '${activePlayer['score']}'`); //don´t work O_o
}

function loss(res)
{
    let losses = document.querySelector('#losses');

    res.textContent = 'YOU LOSE!';
    res.style.color = 'red';
	client.say(channel, `You lose! NotLikeThis `);
	// client.say(channel, `@${tags['display-name']}, You lose! NotLikeThis `);
}

function draw(res)
{
    let draws = document.querySelector('#draws');

    res.textContent = 'DRAW!';
    res.style.color = 'yellow';
	client.say(channel, `Try again!`);
	// client.say(channel, `@${tags['display-name']}, Try again! `);
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function countdown() {
let remainingTimeElement = document.querySelector("#remainingTime"),
             secondsLeft = 10 
			 remainingTime.style.display = "block"

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
	usersElement.textContent = 'You';
      users = {};
    }

// reloads chat with /clear is used
function clearChat(channel) {
    setTimeout(function () {
        window.location.reload(true);
    }, 1000);
}
client.addListener('clearchat', clearChat);
