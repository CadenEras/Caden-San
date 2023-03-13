/** @format */

const Command = require("../../Structures/command");
const Discord = require("discord.js");
const moment = require("moment");
const fs = require("fs");
const config = require("../../Config/config.json");
const Sentry = require("@sentry/node");
require("dotenv").config({ path: "./../../.env" });
let logFileStream = fs.createWriteStream(config.logFileStreamPath, { flags: "a" });
let streamKonsole = new console.Console(logFileStream, logFileStream, false);
let time = Date.now();
const currentDate = new Date(time).toISOString();

module.exports = new Command({
	name: "user-info",
	description: "Shows the author of the message or the mentioned user, their information!",
	usage: "user-info or user-info [user mention]",
	permission: "MANAGE_MESSAGES",
	async run(message, args, client) {
		try {
			const member =
				message.mentions.members.first() ||
				message.guild.members.cache.get(args[0]) ||
				message.member;

			let acknowledgements = "none";
			const admin = member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR, true);

			//Getting member position
			if (member.id === message.guild.ownerId) {
				acknowledgements = "Server Owner";
			} else if (admin) {
				acknowledgements = "Server Administrator";
			} else {
				acknowledgements = "Simple Member";
			}

			const infoEmbed = new Discord.EmbedBuilder()

				//todo : to correct when it's for someone else
				.setTitle("Here is your information :")
				.setColor(member.displayHexColor)
				.setDescription(`Username : ${member.user.username}\nID : ${member.user.id}\n`)
				.setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
				.setAuthor({
					name: `${message.author.username}`,
					iconURL: `${member.user.displayAvatarURL({ dynamic: true })}`,
				})
				.addFields(
					{
						name: "Joined this server on: ",
						value: `${moment(member.joinedAt).format("dddd, MMMM Do YYYY")}`,
						inline: true,
					},
					{
						name: "Created at: ",
						value: `${moment(member.user.createdAt).format(
							"dddd, MMMM Do YYYY, HH:mm:ss"
						)}`,
						inline: true,
					},
					{ name: "Status: ", value: `${member.presence?.status}`, inline: true },
					{ name: "Bannable : ", value: `${member.bannable}`, inline: true },
					{ name: "Kickable : ", value: `${member.kickable}`, inline: true },
					{ name: "Manageable : ", value: `${member.manageable}`, inlinetrue },
					{ name: "Acknowledgements: ", value: `${acknowledgements}`, inline: true },
					{
						name: `Roles [${
							member.roles.cache
								.filter((r) => r.id !== message.guild.id)
								.map((roles) => `\`${roles.name}\``).length
						}]`,
						value: `${
							member.roles.cache
								.filter((r) => r.id !== message.guild.id)
								.map((roles) => `<@&${roles.id}>`)
								.join(" **|** ") || "No Roles"
						}`,
						inline: true,
					}
				)
				.setTimestamp()
				.setFooter({ text: `Caden-San's info module` });

			await message.channel.send({ embeds: [infoEmbed] });

			//TODO: when a raw id is typed, do not send intel about the user that sent the message, return an error instead
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
