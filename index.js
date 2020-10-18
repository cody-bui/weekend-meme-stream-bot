const Discord = require('discord.js');
const fs = require('fs');
const { token, prefix } = require('./config.json');

const client = new Discord.Client();

// import a directory (possibly only need commands & tasks)
function importDir(dir) {
	const files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
	const collection = new Discord.Collection();

	for (const item of files) {
		try {
			const req = require(`${dir}${item}`);
			collection.set(req.name, req);

		} catch (err) {
			console.log(`cannot import from ${dir}${item}`);
			console.log(err);
		}
	}

	return collection;
}

const cmdlist = importDir('./commands/');
const tasklist = importDir('./tasks/');


client.on('ready', () => {
	console.log('bot online');
});

client.on('message', async message => {
	if (message.author.bot) // ignore bot messages (separate with prefix comparison so bot can say 'nice' below)
		return;

	else if (message.content == 'nice') // if the mssage is strictly 'nice', bot will reply 'nice' immediately
		message.channel.send('nice');

	else if (!message.content.startsWith(prefix))
		return;

	else {
		console.log(message.content);
		
		let content = message.content.trim().toLowerCase().slice(prefix.length).split(/ +/);
		let cmd = content[0];
		let args = content.splice(1);

		// check hashmap for command, execute 'others' if cannot find
		let func = await(async () => cmdlist.find(cmd) ? cmdlist.get(cmd) : cmdlist.get('others'));
		func.execute(message, args);
	}
});


client.on('disconnect', () => {
	console.log('bot offline');
});


client.login(token);