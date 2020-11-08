const Discord = require('discord.js');
const fs = require('fs');
const { token, commands, tasks } = require('./config.json');

const client = new Discord.Client();

/* imports ---------------------------- */

/**
 * import all modules from a directory
 * @param {Discord.Collection} collection collection of command
 * @param {String} dir directory to import
 * @param {Array} exclude js files to exclude (filename only, no need js extension)
 * @return collection
 */
function importDir(collection, dir, exclude) {
	const files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));

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

// import commands
let cmdlist = importDir(new Discord.Collection(), './src/commands/');
cmdlist = importDir(cmdlist, './src/music-player/');
let tasklist = importDir(new Discord.Collection(), './src/tasks/');

// import components
const player = require('./src/music-player/player');


/* server events ---------------------- */

client.on('ready', () => {
	console.log('bot online');
});


client.on('disconnect', () => {
	console.log('bye');
});


client.on('message', async message => {
	if (message.author.bot) // ignore bot messages (separate with prefix comparison so bot can say 'nice' below)
		return;

	else if (message.content == 'nice') // if the mssage is strictly 'nice', bot will reply 'nice' immediately
		message.channel.send('nice');

	else if (message.content.startsWith(commands)) // run command
		command(message);

	else if (message.content.startsWith(tasks)) // run task
		task(message);

	else
		return;
});


/** functions ------------------------- */

// execute command
function command(message) {
	let content = message.content.trim().slice(commands.length).split(/ +/);
	let cmd = content[0];
	let args = content.splice(1);
	let special = null; // special args for some commands

	// check hashmap for command, execute 'msg' if cannot find
	let func = cmdlist.find(item => item.name === cmd) ? cmdlist.get(cmd) : cmdlist.get('msg');

	// some commands will require special args
	switch (func.name) {
		case 'msg':
			special = cmd;
			break;

		case 'play':
		case 'queue':
		case 'player':
			special = player;
			break;
			
		default:
			special = client;
			break;
	}

	console.log(`${message.content} -> ${func.name} | ${args} | ${special}`);
	func.exec(message, args, special);
}


// execute tasks
function task(message) {
	let content = message.content.trim().slice(tasks.length).split(/ +/);
	let cmd = content[0];
	let args = content.splice(1);

	// check hashmap for command, execute 'msg' if cannot find
	let func = tasklist.get(cmd);

	console.log(message.content + ' >> ' + func.name);
	func.exec(message, args);
}


// exit bot
['exit', 'SIGINT'].forEach(event => process.on(event, () => {
	client.destroy();
}))


client.login(token);