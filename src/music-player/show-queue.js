// stream music

module.exports = {
	name: 'queue',

	exec(message, args, player) {
		player.showQueue(message);
	}
}