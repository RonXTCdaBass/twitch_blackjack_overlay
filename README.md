# twitch_blackjack_overlay

## my interpretation and first try to make a playable blackjack overlay version for twitch (for OBS)

 for self-hosting required: 	
 		
   		• Webspace (because to many errors while trying local without a server installed) ,
 
		• Twitch account for the Bot ,
   
		• and a streaming app like OBS
  

 It uses TMI.js to connect to Twitch chat. Twitch Auth token needed for the Bot. 

 use https://twitchapps.com/tmi/ to create the oauth key 



### After preparation, put your data into the js/twitch.js file 

simple with a texteditor of your choice

		 " identity: {
		username: 'YOUR_BOTNAME',
		password: 'YOUR_BOT_OAUTH:TOKEN',
			},
		 "

 after this, you can use https://obfuscator.io/ to make your data a lil bit harder to read ... 
 but its still to find, for somebody who knows how!!! 
 so better don´t use your Streamer-Account instead a Bot-Acc.

 

### Now it´s time to upload to your webspace!
 
 you can use the complete "web" folder only and rename how you like, then

 call the overlay with http://YOUR_URL/YOUR_FOLDER/game.php and add setting "?channel=YOUR_CHANNEL" 
 
 * like [example.play/jack/game.php?channel=justplay]
 
 
 or just upload the complete folder structure including the files and call the "index.php" for generating the overlay-link.
 
 then put the link as browser-source into your OBS.
 
 the example and local-files are not needet for webhosting.

 -------------------------------------------------------------------

### !!! the game is still invisible, until someone call the "!jack" command in your channel !!!

 Player-commands are:  !jack - to show the game | !hit - to draw a card | !stand - to stand with enough cards ^^ | !deal - to manually end the round
 
 
 +++ streamer can use the !deal command for end the game everytime, no matter who started the round!

 p.s. you can use the shown buttons too, after someone calls the "!jack" ...for testing or just play for yourself ...

 

 DEMO:  http://twitch-jack.rf.gd   (server runs with php)
 

 far from perfect ...still incomplete ;) but still working fine for me ^^
 
 ![twitch-jack_screenshot](https://github.com/user-attachments/assets/443c4111-719c-4e16-88e1-1539b4b9e2f3)


	todolist

	[ ] answering to the player with name (@user]

	[ ] answering the counted points

	[✔] now the countdown shown correctly.
