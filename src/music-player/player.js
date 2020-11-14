// audio player
const ytdl = require('ytdl-core-discord');
const config = require('../../config.json').player;
const Discord = require('discord.js');

function timeConvert(time) {
	return Math.floor(time / 60) + ':' + time % 60;
}

class Player {
	constructor() {
	}

	// music queue
	queue = new Array();

	// background audio player stuff
	current = null;
	dispatcher;
	streaming = false;
	playing = true;

	/**
	 * play audio while there are songs in it
	 * 
	 * @param {Discord.VoiceConnection} connection
	 * @param {Discord.Message} message 
	 */
	async playAudio(connection, message) {
		this.current = this.queue[0];
		message.channel.send('**now playing:** ' + this.current.info.title + ' - ' + timeConvert(this.current.info.length_seconds));

		this.dispatcher = connection.play(this.current.stream, {
			type: "opus"
		})
			.on("finish", () => {
				this.queue.shift();

				if (this.queue.length === 0) { // leave once there is no song left
					message.guild.me.voice.channel.leave();
					this.current = null;
					this.streaming = false;

				} else {
					this.playAudio(connection, message);
				}
			});
	}

	/**
	 * play song. will prompt to remove song when queue is full
	 * 
	 * @param {Discord.Message} message
	 * @param {Sring} url url of the audio track
	 */
	async play(message, url) {
		this.queue.push({
			info: await ytdl.getInfo(url, {}),
			stream: await ytdl(url, {
				filter: 'audioonly',
				quality: 'highestaudio',
				highWaterMark: 1 << 25,
				begin: 0,
			})
		});

		console.log(this.queue.length);

		if (this.queue.length === 1) {
			message.member.voice.channel.join()
				.then(connection => this.playAudio(connection, message));
		}
		else
			message.channel.send('added');
	}


	/**
	 * display queue stats
	 * 
	 * @param {Discord.Message} message 
	 */
	async showQueue(message) {
		let data = new Discord.MessageEmbed()
			.setColor('#FE0102')
			.setTitle(`${this.queue.length} song(s) left in the queue`)
			.addFields(this.queue.map((item, index) => ({
				name: `${index}. ${item.info.title}`, value: `length: ${timeConvert(item.info.length_seconds)}`, inline: false
			})))

		message.channel.send(data);
	}


	/**
	 * play a certain song in the queue
	 * 
	 * @param {Discord.Message} message 
	 * @param {Number} num 
	 */
	async playSong(message, num) {

	}


	/**
	 * remove a certain song in the queue
	 * 
	 * @param {Discord.Message} message 
	 * @param {Number} num 
	 */
	async removeSong(message, num) {

	}


	/**
	 * play pause music
	 * 
	 * @param {Discord.Message} message 
	 */
	playPause(message) {
		if (!this.streaming) {
			message.channel.send("shut up i'm not playing music rn");
			return;
		} else if (this.playing) {
			this.playing = false;
			this.dispatcher.pause();
		} else {
			this.playing = true;
			this.dispatcher.resume();
		}
	}
}

module.exports = {
	Player: Player
}