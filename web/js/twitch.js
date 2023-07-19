export { client };
export { channel };

const params = new URLSearchParams(window.location.search);
const channel = params.get('channel'); 
const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: 'YOUR_BOTNAME',
		password: 'YOUR_BOT_OAUTH:TOKEN',
	},

  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [channel],
});
