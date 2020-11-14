// play a song

module.exports = {
	name: 'play',

	async exec(message, args, player) {
		if (!message.member.voice.channel) {
			message.channel.send("shut tf up you're not in voice chat");
			return;
		}

		// never gonna give you up, never gonna let you down
		if (!args)
			args[0] = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

		player.play(message, args[0]);
	}
}