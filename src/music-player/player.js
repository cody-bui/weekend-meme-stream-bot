// audio player
const ytdl = require('discord-ytdl-core');
const config = require('../../config.json').player;
const Discord = require('discord.js');

// music queue
const queue = new Array();

// background audio player stuff
let current;
let playing = false;

/**
 * play audio while there are songs in it
 * 
 * @param {Discord.Message} message 
 */
async function playAudio(message) {
	playing = true;
	message.member.voice.channel
		.join()
		.then(connection => {
			while (queue.length > 0) {
				current = queue[0];
				queue.shift();

				connection.play(current, {
					type: "opus"
				})
					.on("finish", () => {
						if (queue.length === 0) { // leave once there is no song left
							message.guild.me.voice.channel.leave();
							current = null;
						}
					});
			}
		})
		.then(() => playing = false);
}


/**
 * play song. will prompt to remove song when queue is full
 * 
 * @param {Discord.Message} message 
 * @param {FFmpeg} stream 
 */
function play(message, stream) {
	// add song to the queue
	if (queue.length < config.queueLength) {
		queue.push(stream);
		if (queue.length === 1 && !playing)
			playAudio(message);
	}
	
	// too many songs in the queue, show all songs and prompt to remove one
	else {
		console.log('too many songs in the queue');
		message.channel.send([
			'Too many songs in the queue, try removing some',
			new Discord.MessageEmbed()
				.setColor('#FE0102')
				.setDescription('Current songs in the queue')
				.addFields(queue.map((item, index) => ({
					value: `${index}. ${item}`, inline: false
				})))
		])
	}
}


/**
 * display queue stats
 * 
 * @param {Discord.Message} message 
 */
function showQueue(message) {
	let data = new Discord.MessageEmbed()
		.setColor('#FE0102')
		.setTitle(`${queue.length} song(s) left in the queue`)
		.setDescription(`You can add up to ${config.queueLength} songs into the queue`)
		.addFields(queue.map((item, index) => ({
			value: `${index}. ${item}`, inline: false
		})))

	message.channel.send(data);
}


/**
 * play a certain song in the queue
 * 
 * @param {Discord.Message} message 
 * @param {Number} num 
 */
function playSong(message, num) {

}


/**
 * remove a certain song in the queue
 * 
 * @param {Discord.Message} message 
 * @param {Number} num 
 */
function removeSong(message, num) {

}


/**
 * play pause music
 * 
 * @param {Discord.Message} message 
 */
function playPause(message) {

}


module.exports = {
	play: (message, stream) => play(message, stream),
	showQueue: (message) => showQueue(message),
	playSong,
	removeSong,
	playPause
}