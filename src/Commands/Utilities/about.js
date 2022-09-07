/** @format */

const Command = require("../../Structures/command");
require("dotenv").config({ path: "./../../.env" });
const Discord = require("discord.js");
const fs = require("fs");
const config = require("../../Config/config.json");
const Sentry = require("@sentry/node");
let logFileStream = fs.createWriteStream(config.logFileStreamPath, { flags: "a" });
let streamKonsole = new console.Console(logFileStream, logFileStream, false);
let time = Date.now();
const currentDate = new Date(time).toISOString();

module.exports = new Command({
	name: "about",
	description: "Get information about Caden-San",
	usage: "c!about",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
		try {
			//todo make this automatic
			//Getting uptime the old way
			let totalSeconds = client.uptime / 1000;
			let days = Math.floor(totalSeconds / 86400);
			let hours = Math.floor(totalSeconds / 3600);
			totalSeconds %= 3600;
			let minutes = Math.floor(totalSeconds / 60);
			let seconds = totalSeconds % 60;

			let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

			const baseChannelInfoId = client.channels.cache.find(
				(channel) => channel.id === config.baseInfoChannelId
			);
			const embed1 = new Discord.EmbedBuilder()
				.setTitle("Caden-San")
				.setColor("#af4ae9")
				.setDescription(
					"Hi ! I'm Caden-San, a moderation bot created by CadenEras ! Try `c!help` to start with me !"
				)
				.setAuthor("Caden-San", "https://i.imgur.com/ek6dDxa.png")
				.addField(`Art by`, `Opheliart#3547 (633310607730278402)`)
				.addField(`Language`, `JavaScript`, true)
				.addField(`Prefix`, `c!`, true)
				.addField(`Owner`, `CadenEras#2020 (795326819346808832)`, true)
				.addField(`Creation date`, `July 2021`, true)
				.addField(`Maintenance Server`, `https://discord.gg/P7JeGwBRYU`, true)
				.addField(`Repository (GitHub)`, `https://github.com/CadenEras/Caden_San`, true)
				.addField(
					`Memory usage`,
					`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(
						process.memoryUsage().heapUsed /
						1024 /
						1024
					).toFixed(2)} MB Heap.`,
					true
				)
				.addField(`Uptime`, `${uptime}`, true)
				.addField(`Guilds`, `${client.guilds.cache.size}`)
				.addField(`Shards`, `To come~`)
				.setImage("https://i.imgur.com/ek6dDxa.png")
				.setTimestamp()
				.setFooter("Made By CadenEras#2020, with love <3");

			await baseChannelInfoId.send({ embeds: [embed1] });
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
