/** @format */

const Command = require("../../Structures/command");
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
	name: "server-info",
	description: "Get information of the current server !",
	usage: "server-info",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
		try {
			//todo : maybe add some information
			const embed1 = new Discord.EmbedBuilder()

				.setTitle(`Here is ${message.guild.name}'s information :`)
				.setColor("#af4ae9")
				.setDescription(
					`Guild's name : ${message.guild.name}\nGuild's ID : ${message.guild.id}\nCreated on : ${message.guild.createdAt}\nMember count : ${message.guild.memberCount}\nOwner <@${message.guild.ownerId}> (${message.guild.ownerId})\n`
				)
				.setThumbnail(`${message.guild.iconURL()}`)
				.setAuthor({
					name: `${message.guild.name}`,
					iconURL: `${message.guild.iconURL()}`,
				})
				.setTimestamp();

			//todo : if argument is provided, return a message to advise that it's not needed
			await message.channel.send({ embeds: [embed1] });
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
