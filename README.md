## weekend-meme-stream-bot

### AKA. *pod*
Discord bot for our weekend meme stream  
bot testing on channel #bot-test

<br>

### instruction
#### **config**
you **MUST** config the bot before running it
* a sample `config-sample.json` file is provided
* most options can be let as default: image type, command prefixes...
* you **MUST** provide your own data for fields with `[...]`: [access token](https://discord.com/developers/applications), folder path...
* after done, rename that file to `config.json`

#### **run**
* run `npm i` after cloning
* if you're using [nodemon](https://www.npmjs.com/package/nodemon) for development: `nodemon`
* otherwise, `npm start`

<br>

### current features
* swearing
* basic messages
* send help
* restart & stop commands
* play music:
  + play tracks & add music to queue
  + show music queue
