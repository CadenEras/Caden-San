/** @format */

const { SlashCommandBuilder } = require("discord.js");
const Sentry = require("@sentry/node");
const config = require("../../Config/config.json");
const fs = require("fs");
let logFileStream = fs.createWriteStream(config.logFileStreamPath, { flags: "a" });
let streamKonsole = new console.Console(logFileStream, logFileStream, false);
let time = Date.now();
const currentDate = new Date(time).toISOString();

module.exports = {
	data: new SlashCommandBuilder().setName("Ping").setDescription("Pong ?!"),
	async execute(interaction) {
		try {
			function randRespond() {
				let index = Math.floor(Math.random() * responses.length);
				return responses[index];
			}

			let responses = [];

			responses = [
				`pong ! I'm alive ! ${Math.round(interaction.client.ws.ping)} ms, ${
					Date.now() - interaction.createdTimestamp
				} ms.`,
				`pong ! I'm here ! How are you ?  ${Math.round(interaction.client.ws.ping)} ms, ${
					Date.now() - interaction.createdTimestamp
				} ms.`,
				`Yes I am awake ! Pong => ${Math.round(interaction.client.ws.ping)} ms, ${
					Date.now() - interaction.createdTimestamp
				} ms.`,
				`Are we playing ping-pong ?  ${Math.round(interaction.client.ws.ping)} ms, ${
					Date.now() - interaction.createdTimestamp
				} ms.`,
				`pong ? ${Math.round(interaction.client.ws.ping)} ms, ${
					Date.now() - interaction.createdTimestamp
				} ms.`,
				`Stop pinging mee !  ${Math.round(interaction.client.ws.ping)} ms, ${
					Date.now() - interaction.createdTimestamp
				} ms.`,
			];

			await interaction.reply(randRespond());
		} catch (error) {
			Sentry.captureException(error);
			streamKonsole.error(
				`${currentDate} => error occurred in ${interaction.guild.id} => \n\t\t\t => ${error}`
			);

			const channelDev = interaction.client.guilds.cache
				.get(config.baseGuildId)
				.channels.cache.find((channel) => channel.id === config.baseDevLogChannelId);
			channelDev.send(
				`An Error occurred in ${interaction.guild.name} (${interaction.guild.id}). Stack error log : ${error}`
			);
			return interaction.reply(
				`Something went wrong... You should report that in my maintenance server with your guild id and the command you tried to use.`
			);
		}
	},
};
