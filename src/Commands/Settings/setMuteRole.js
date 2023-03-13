/** @format */

const Command = require("../../Structures/command");
const mongoose = require("mongoose");
const Discord = require("discord.js");
const fs = require("fs");
const config = require("../../Config/config.json");
const Sentry = require("@sentry/node");
require("dotenv").config({ path: "./../../.env" });
let logFileStream = fs.createWriteStream(config.logFileStreamPath, { flags: "a" });
let streamKonsole = new console.Console(logFileStream, logFileStream, false);
let time = Date.now();
const currentDate = new Date(time).toISOString();

module.exports = new Command({
	name: "setMuteRole",
	description: "Set your custom mute role",
	usage: "setMuteRole (roleID)",
	permission: "ADMINISTRATOR",
	async run(message, args, client) {
		try {
			if (!args[1])
				return message.reply(
					"Forgot how to use this command ? Try `c!help setMuteRole` to see how it works."
				);
			let guildData;
			if (!guildData) guildData = await client.DataBase.fetchGuild(message.guild.id);

			let muteRole = args.slice(1).join(" ");

			let fetched = message.guild.roles.cache.find((role) => role.id === args[1]);

			if (!fetched) {
				return message.channel.send("This Id is not a valid role. Please retry.");
			}

			guildData.muteRoleId = muteRole;
			await guildData.save();

			message.guild.muteRole = muteRole.toLowerCase();

			return message.channel.send(`The new mute role is : <@&${muteRole}> (${muteRole})`);
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
