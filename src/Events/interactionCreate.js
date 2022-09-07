/**@format */

const Discord = require("discord.js");
const Event = require("../Structures/event");
const config = require("./../Config/config.json");
const fs = require("fs");
const Sentry = require("@sentry/node");
let logFileStream = fs.createWriteStream(config.logFileStreamPath, { flags: "a" });
let streamKonsole = new console.Console(logFileStream, logFileStream, false);
let time = Date.now();
const currentDate = new Date(time).toISOString();

module.exports = new Event("interactionCreate", (client, interaction) => {
	if (
		interaction.user.bot ||
		!interaction.isCommand() ||
		!interaction.guild ||
		!interaction.isChatInputCommand()
	) {
		return;
	}

	//Not used/working
	//TODO slash command to add

	//Maybe not usable in this case ?
	/*const args = [
		interaction.commandName,
		...client.commands
			.find( ( command ) => command.name.toLowerCase() === interaction.commandName )
			.slashCommandOptions.map( ( v ) => `${interaction.options.get( v.name ).value}` ),
	];*/

	const command = client.commands.get(interaction.commandName);

	//if( !command ) return interaction.reply( "Hm... That is not a valid command." );

	const permission = interaction.member.permissions.has(command.permission);

	if (!permission) {
		return interaction.reply("Hm... Wait ! You does not have the permission to do that.");
	}

	try {
		command.run(client, interaction);
	} catch (error) {
		//handle error (always sending errors to Sentry too)
		Sentry.captureException(error);
		streamKonsole.error(
			`${currentDate} => error occurred in ${interaction.guild.id} => \n\t\t\t => ${error}`
		);

		const channelDev = client.guilds.cache
			.get(config.baseGuildId)
			.channels.cache.find((channel) => channel.id === config.baseDevLogChannelId);
		channelDev.send(
			`${currentDate} => An Error occurred in ${interaction.guild.name} (${interaction.guild.id}). Stack error log : ${error}`
		);
		return interaction.reply(
			`Something went wrong... You should report that in my maintenance server with your guild id and the command you tried to use.`
		);
	}
});
