/** @format */

const Discord = require("discord.js");
const Command = require("../../structures/command");
const fs = require("fs");
const config = require("../../Config/config.json");
const Sentry = require("@sentry/node");
require("dotenv").config({ path: "./../../.env" });
let logFileStream = fs.createWriteStream(config.logFileStreamPath, { flags: "a" });
let streamKonsole = new console.Console(logFileStream, logFileStream, false);
let time = Date.now();
const currentDate = new Date(time).toISOString();

module.exports = new Command({
	name: "msg",
	description: "Sending message via V-Soho",
	usage: "msg [channel] [msg]",
	permission: "ADMINISTRATOR",
	async run(message, args, client) {
		try {
			if (message.author.id !== config.ownerID) {
				return;
			}

			if (!args[1]) {
				return message.reply(
					"Forgot how to use this command ? Try `c!help mute` to see how it works."
				);
			}

			const validChannel = message.guild.channels.cache.get(args[1]);
			//const validChannel = client.channels.cache.find((channel) => channel.id === args[1])
			if (!validChannel) {
				return message.reply("This is not a valid channel ! Please retry.");
			}

			const msgToSend = args.slice(2, 3500).join(" ");
			if (!msgToSend)
				return message.reply(
					"You need to provide a message whose length is at least 2 and at most 3500 characters."
				);

			await validChannel.send(msgToSend);
		} catch (error) {
			Sentry.captureException(error);
			streamKonsole.error(
				`${currentDate} => error occurred in ${message.guild.id} => \n\t\t\t => ${error}`
			);

			const channelDev = client.guilds.cache
				.get(config.baseGuildId)
				.channels.cache.find((channel) => channel.id === config.baseDevLogChannelId);
			channelDev.send(
				`An Error occurred in ${message.guild.name} (${message.guild.id}). Stack error log : ${error}`
			);
			return message.reply(
				`Something went wrong... You should report that in my maintenance server with your guild id and the command you tried to use.`
			);
		}
	},
});
