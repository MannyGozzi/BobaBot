const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, apiKey } = require('./config.json');

// Import the functions you need from the SDKs you need
const firebase = require("firebase/app");
const { BUTTON_PREFIX } = require('./constants.js');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "boba-bot-a53b9.firebaseapp.com",
  databaseURL: "https://boba-bot-a53b9-default-rtdb.firebaseio.com",
  projectId: "boba-bot-a53b9",
  storageBucket: "boba-bot-a53b9.appspot.com",
  messagingSenderId: "427023726537",
  appId: "1:427023726537:web:024c09f2fcdb56a5259a18"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const client = new Client({ 	intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildVoiceStates,
], });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


client.once(Events.ClientReady, () => {
	console.log('Bot Online 🔥');
});

client.on(Events.InteractionCreate, async interaction => {

	if (interaction.isButton()) {
		switch (interaction.customId) {
			case `${BUTTON_PREFIX}skip`:
				const skipSong = require('./buttonCommands/skipButton.js').execute;
				skipSong(interaction);
				break;
			case `${BUTTON_PREFIX}pause`:
				const pauseSong = require('./buttonCommands/pausetoggleButton.js').execute;
				pauseSong(interaction);
				break;
			case `${BUTTON_PREFIX}stop`:
				const stopSong = require('./buttonCommands/stopButton.js').execute;
				stopSong(interaction);
				break;
			default:
				break;
		}
	}

	if (interaction.isChatInputCommand()) {

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	}

	return;
});

client.login(token);