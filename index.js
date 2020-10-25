const Discord = require('discord.js');
const fs = require('fs');
const { token, commands, tasks } = require('./config.json');

const client = new Discord.Client();

// import a directory (possibly only need commands & tasks)
function importDir(dir) {
	const files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
	const collection = new Discord.Collection();

	for (const item of files) {
		try {
			const req = require(`${dir}${item}`);
			if (req.name)
				collection.set(req.name, req);

		} catch (err) {
			console.log(`cannot import from ${dir}${item}`);
			console.log(err);
		}
	}

	return collection;
}

const cmdlist = importDir('./src/commands/');
const tasklist = importDir('./src/tasks/');


client.on('ready', () => {
	console.log('bot online');
});


client.on('message', async message => {
	if (message.author.bot) // ignore bot messages (separate with prefix comparison so bot can say 'nice' below)
		return;

	else if (message.content == 'nice') // if the mssage is strictly 'nice', bot will reply 'nice' immediately
		message.channel.send('nice');

	// all commands
	else if (message.content.startsWith(commands)) {
		let content = message.content.trim().toLowerCase().slice(commands.length).split(/ +/);
		let cmd = content[0];
		let args = content.splice(1);
		let special = null; // special args for some commands

		// check hashmap for command, execute 'msg' if cannot find
		let func = cmdlist.find(item => item.name === cmd) ? cmdlist.get(cmd) : cmdlist.get('msg');

		// some commands will require special args
		switch (func.name) {
			case 'msg':
				func.name = cmd;
				special = cmd;
				break;

			case 'exit':
			case 'restart':
				special = client;
				break;

			default: break;
		}

		console.log(message.content + ' >> ' + func.name + ' | ' + args + ' | ' + special);
		func.exec(message, args, special);
	}

	// all tasks
	else if (message.content.startsWith(tasks)) {
		let content = message.content.trim().toLowerCase().slice(tasks.length).split(/ +/);
		let cmd = content[0];
		let args = content.splice(1);

		// check hashmap for command, execute 'msg' if cannot find
		let func = tasklist.get(cmd);

		console.log(message.content + ' >> ' + func.name);
		func.exec(message, args);
	}

	else
		return;
});


client.on('disconnect', () => {
	console.log('bye');
});


// exit bot
['exit', 'SIGINT'].forEach(event => process.on(event, () => {
	console.log('bye');
	client.destroy();
}))


client.login(token);