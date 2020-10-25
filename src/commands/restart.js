// restart the bot: destroy the previous bot and log in again
const { token } = require('../../config.json');

module.exports = {
	name: 'restart',

	/**
	 * restart bot through command
	 * @param {Message} message message stream
	 * @param {Object} args not needed
	 * @param {Discord.Client} client discord client
	 */
	exec(message, args, client) {
		message.channel.send("we'll be right back")
			.then(() => client.destroy())
			.then(() => client.login(token));
	}
} 