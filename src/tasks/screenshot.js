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

	exec(message, args, special) {
		screenshot.all().then((imgs) => {
			console.log(imgs);
		})

		screenshot.listDisplays()
			.then((displays) => {

				for (let index = 0; index < displays.length; index++) {
					const display = displays[index];
					const filename = `${config.path}/${format()} display-${index}.${config.format}`;

					screenshot({ screen: display.id, filename: filename }).then((imgpath) => {
						console.log(imgpath);
					}).catch(err => {
						console.error(err);
					})
				}
			})
	}
}