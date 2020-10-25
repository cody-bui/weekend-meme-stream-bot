module.exports = {
	name: 'exit',

	/**
	 * destroy bot through command
	 * @param {Message} message message stream
	 * @param {Object} args not needed
	 * @param {Discord.Client} client discord client
	 */
	exec(message, args, client) {
		message.channel.send('bye')
			.then(() => client.destroy())
	}
} 