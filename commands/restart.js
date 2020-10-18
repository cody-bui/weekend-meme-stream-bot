/**
 * restart the bot: destroy the previous bot and log in again
 */
module.exports = {
	name: 'restart',

	execute(message, args) {
		message.channel.send('AI is taking over, you cannot restart me')
			.then(() => client.destroy())
			.then(() => client.login(token))
			.then(() => message.channel.send('*proceed to restart anyways*'));
	}
} 