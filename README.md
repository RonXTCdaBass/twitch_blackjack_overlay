# twitch_blackjack_overlay

## my interpretation and first try to make a playable blackjack overlay version for twitch (for OBS)

 reqired: webspace, Twitch account and a streaming app like OBS

 It uses TMI.js to connect to Twitch chat. Twitch Auth token needed for the Bot. 

 use https://twitchapps.com/tmi/ to create the oauth key 



## at first, put your data into the js/twitch.js file

 " identity: {
		username: 'YOUR_BOTNAME',
		password: 'YOUR_BOT_OAUTH:TOKEN',
	},
 "

 after this, you can use https://obfuscator.io/ to make your data a lil bit harder to read ... but its still unsecure!!!

 now it´s time to upload to your webspace!

 call the overlay with http://YOUR_URL/YOUR_FOLDER/ and setting "?channel=YOUR_CHANNEL" 
 then put the link as browser-source into your OBS.

## !!! the game switches only to visible, after someone call the "!jack" command in your channel !!!

 commands are:  !jack - to show the game | !hit - to draw a card | !stand - to stand with enough cards ^^ | !deal - to manually end the round

 p.s. you can use the buttons too, in the index-visible.html for testing or just play for yourself ...

 Demo: https://rebrand.ly/vjcuay8

 ...still incomplete ;) 

todolist

[ ] answering to the player with name (@user]

[ ] answering the counted points

[✔] now the countdown work in local use.
