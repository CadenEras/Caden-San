/** @format */

const Event = require("../Structures/event");
const fs = require("fs");
const config = require("../Config/config.json");
const Sentry = require("@sentry/node");
let logFileStream = fs.createWriteStream(config.logFileStreamPath, { flags: "a" });
let streamKonsole = new console.Console(logFileStream, logFileStream, false);
let time = Date.now();
const currentDate = new Date(time).toISOString();

module.exports = new Event("guildMemberAdd", async (client, member) => {
	//Only send welcome message if welcome message is enabled
	//ToDo: make it customizable

	let guildOfMember = member.guild;
	let guildCard = await client.DataBase.fetchGuild(guildOfMember.id);

	if (
		guildCard.addons.welcome.enabled ||
		guildCard.addons.welcome.channelId !== null ||
		guildCard.addons.welcome.message !== null
	) {
		let welcomeChannel = guildCard.addons.welcome.channelId;
		let fetchedChannel = client.guilds.cache
			.get(member.guild.id)
			.channels.cache.get(welcomeChannel);

		let welcomeMessage = guildCard.addons.welcome.message;

		try {
			await fetchedChannel.send(welcomeMessage);
		} catch (error) {
			Sentry.captureException(error);
			streamKonsole.log(`${currentDate} => ${error}`);
		}
	}
});
