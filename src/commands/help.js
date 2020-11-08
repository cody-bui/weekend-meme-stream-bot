// send help command

var fs = require('fs');

function read(url) {
	try {
		return fs.readFileSync(url, 'utf8');
	} catch (e) {
		console.log(e.stack);
	}
}

module.exports = {
	name: 'help',

	exec(message) {
		message.channel.send(read('./help.md'));
	}
}