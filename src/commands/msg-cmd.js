// place all message commands here
const map = new Map();
map.set('ping', 'shut the fuck up');
map.set('others', '<http://bitly.com/98K8eH>'); // DO NOT change the key for this one

module.exports = {
	name: 'msg',

	exec: (message, args) => { // use args as message key
		message.channel.send(map.has(args) ? map.get(args) : map.get('others'));
	}
}