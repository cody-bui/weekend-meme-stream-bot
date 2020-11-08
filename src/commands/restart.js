// restart the bot: destroy the previous bot and log in again
const { token } = require('../../config.json');

module.exports = {
	name: 'restart',

	exec(message, args, client) {
		message.channel.send("we'll be right back")
			.then(() => client.destroy())
			.then(() => client.login(token));
	}
} 