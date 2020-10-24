const screenshot = require('screenshot-desktop');
const config = require('../../config.json').screenshot;

function format() {
	let date = new Date();
	return date.toString().split(':').join('-');
}

/**
 * capture device screenshot
 * NOTE: can only be captured on the bot host device
 * NOTE: screenshot cannot be used on WSL (cannot detect display)
 */
module.exports = {
	name: 'screenshot',

	exec(message, args) {
		screenshot({ filename: `${config.path}/${format()}.${config.format}` })
			.then(img => {

			}).catch(err => {
				console.log('cannot take screenshots');
				console.log(err);
			});
	}
} 