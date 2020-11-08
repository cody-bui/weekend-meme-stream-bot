// stream music

const ytdl = require('discord-ytdl-core');

module.exports = {
	name: 'play',

	exec(message, args, player) {
		if (!message.member.voice.channel) {
			message.channel.send("shut tf up you're not in voice chat");
			return;
		}

		// never gonna give you up, never gonna let you down
		if (!args)
			args[0] = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

		let stream = ytdl(args[0], {
			filter: "audioonly",
			opusEncoded: true,
		});

		player.play(message, stream);
	}
}