/* imports ---------------------------- */

const Discord = require('discord.js');
const fs = require('fs');
const { token, commands, tasks } = require('./config.json');

const client = new Discord.Client();

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

const Player = require('./src/music-player/player').Player;
const player = new Player();


/* server events ---------------------- */

client.on('ready', () => {
	console.log('bot online');
});


client.on('disconnect', () => {
	console.log('bye');
});



// a command that can takeover the parsing of the message, bypassing every filter
let takeoverMode = false;
let takeoverCmd = null;


client.on('message', async message => {
	// ignore bot messages
	if (message.author.bot)
		return;

	// if the mssage is strictly 'nice', bot will reply 'nice' immediately
	else if (message.content === 'nice')
		message.channel.send('nice');

	// if still in takeover mode, divert message to that command
	else if (takeoverMode) {
		takeoverMode = takeoverCmd.takeover(message);
		if (!takeoverMode)
			console.log('takeover mode OFF');
	}

	else if (message.content.startsWith(commands))
		command(message);

	else if (message.content.startsWith(tasks))
		task(message);

	else
		return;
});


/* functions -------------------------- */

// execute command
function command(message) {
	let content = message.content.trim().slice(commands.length).split(/ +/);
	let cmd = content[0];
	let args = content.splice(1);
	let special = null; // special args for some commands

	// check hashmap for command, execute 'msg' if cannot find
	let func = cmdlist.find(item => item.name === cmd) ? cmdlist.get(cmd) : cmdlist.get('msg');

	// if the command has specific takeover function, divert the command to it for as long as it returns true
	if (func.takeover) {
		console.log(`takeover mode ON - ${cmd.name}`);
		takeoverMode = true;
		takeoverCmd = func;
		func.takeover(message);

	}

	// else, run exec function
	else {

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
}


// execute tasks
function task(message) {
	let content = message.content.trim().slice(tasks.length).split(/ +/);
	let cmd = content[0];
	let args = content.splice(1);

	// check hashmap for command, execute 'msg' if cannot find
	let func = tasklist.get(cmd);

	console.log(`${message.content} -> ${func.name} | ${args}`);
	func.exec(message, args);
}


// exit bot
['exit', 'SIGINT'].forEach(event => process.on(event, () => {
	client.destroy();
}))


client.login(token);