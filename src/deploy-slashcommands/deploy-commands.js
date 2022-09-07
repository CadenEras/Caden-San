/** @format */

//In development
const Rest = require("@discordjs/rest");
const { Routes } = require("discord.js");
const config = require("../Config/config.json");
const fs = require("fs");
let logFileStream = fs.createWriteStream(config.logFileStreamPath, { flags: "a" });
let streamKonsole = new console.Console(logFileStream, logFileStream, false);
let time = Date.now();
const currentDate = new Date(time).toISOString();

commands = [];

fs.readdirSync("./SlashCommands").forEach((dirs) => {
	const commands = fs
		.readdirSync(`./SlashCommands/${dirs}`)
		.filter((files) => files.endsWith(".js"));

	for (const file of commands) {
		const command = require(`../SlashCommands/${dirs}/${file}`);
		commands.push(command.data.toJSON());
	}
});

const rest = new Rest.REST({ version: "10" }).setToken(config.token);

(async () => {
	try {
		streamKonsole.log(
			`Caden started refreshing ${commands.length} application slash commands...`
		);

		const data = await rest.put(Routes.applicationCommands(config.selfId), { body: commands });

		streamKonsole.log(
			`Caden successfully reloaded ${data.length} application slash commands !`
		);
	} catch (error) {
		streamKonsole.error(`${currentDate} => Error while deploying slash commands : ${error}`);
	}
})();
