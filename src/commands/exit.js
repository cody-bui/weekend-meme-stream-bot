// stop the bot
module.exports = {
	name: 'exit',

	exec(message, args, client) {
		message.channel.send('bye')
			.then(() => client.destroy())
	}
} 