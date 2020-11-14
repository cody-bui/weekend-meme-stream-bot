// send help command

var fs = require('fs');
var Discord = require('discord.js');

function read(url) {
	try {
		return fs.readFileSync(url, 'utf8');
	} catch (e) {
		return null;
	}
}

const helpDir = './help/';

module.exports = {
	name: 'help',

	exec(message, args) {
		if (!args[0])
			args[0] = 'general';

		let text = read(`${helpDir}${args[0]}.md`);
		if (text === null)
			text = read(`${helpDir}general.md`);

		message.channel.send(new Discord.MessageEmbed()
			.setColor('#0099FF')
			.setTitle('help')
			.setDescription(text)
		);
	}
}