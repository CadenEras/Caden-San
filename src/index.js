/**@format */

/*
 *
 * Caden-San, moderation bot for discord
 * Created on july 2021 under GNU GPL v3 License
 * by Melissa Gries (CadenEras) CadenEras#2020(795326819346808832)
 *
 */

//This is the start, nothing above, everything below !
const discord = require("discord.js");
const mongoose = require("mongoose");
const config = require("./Config/config.json");
const fs = require("fs");

//Using Sentry here => sentry.io
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/node");

//Redirecting the output in a file. The two lines of code below are wherever needed in the whole code
let logFileStream = fs.createWriteStream(config.logFileStreamPath, { flags: "a+" });
let streamKonsole = new console.Console(logFileStream, logFileStream, false);
//Setting the time for log...
let time = Date.now();
//...in a readable format
const currentDate = new Date(time).toISOString();

//Initializing Sentry connection
Sentry.init({
	dsn: config.dsnSentry,
	integrations: [
		new Tracing.Integrations.Mongo({
			useMongoose: true,
		}),
	],
	tracesSampleRate: 1.0,
});

const client = new discord.Client({ intents: [discord.GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, '../Commands');
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
			console.log(`${currentDate} => [WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			streamKonsole.log(`${currentDate} => [WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, readyClient => {
	streamKonsole.log(
		`[CLIENT INFO] Time : ${readyClient.readyAt}.\n Caden is up, logged in as ${readyClient.user.tag} (${readyClient.user.id}), ready on ${readyClient.guilds.cache.size} servers.`
	);

	console.log(
		`[CLIENT INFO] Time : ${readyClient.readyAt}.\n Caden is up, logged in as ${readyClient.user.tag} (${readyClient.user.id}), ready on ${readyClient.guilds.cache.size} servers.`
	);

	readyClient.user.setPresence({
		activities: [
			{
				name: "the gatekeeper | c!help",
				type: 0,
			},
		],
		status: "online",
	});
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(`${currentDate} => There was an error while executing this command : ${error}`);
		streamKonsole.log(`${currentDate} => There was an error while executing this command : ${error}`);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

//And then try everything here
try {
	//connecting to the database
	mongoose.connect(config.mongo);

	//Catching Mongo events
	mongoose.connection.on("connected", () => {
		streamKonsole.log(`${currentDate} => Caden-San is now connected to the database !`);
	});

	mongoose.connection.on("disconnected", () => {
		streamKonsole.log(`${currentDate} => Caden-San has disconnected from the database !`);
	});

	//Starting the client
	client.login(config.token);
} catch (e) {
	//Handling errors
	streamKonsole.log(`${currentDate} => Error while initializing connection / client : ${e}`);
	Sentry.captureException(e);
}

//Prevent from crashing on uncaught Exception from the try catch
process.on("uncaughtException", (err) => {
	Sentry.captureException(err);
	console.log(`${currentDate} => Uncaught Exception : ${err}`);
	streamKonsole.log(`${currentDate} => Uncaught Exception : ${err}`);
});

//Tracking API errors
process.on('unhandledRejection', error => {
	Sentry.captureException(err);
	console.error(`${currentDate} => Unhandled promise rejection : ${error}`);
	streamKonsole.log(`${currentDate} => Unhandled promise rejection : ${err}`);
});
