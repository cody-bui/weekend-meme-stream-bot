// stream music

module.exports = {
	name: 'queue',

	exec(message, args, player) {
		console.log(player);
		player.showQueue(message);
	}
}