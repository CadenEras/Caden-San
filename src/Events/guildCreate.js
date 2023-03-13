/** @format */

const Event = require("../Structures/event");
//const mongoose = require( "mongoose" );
//const Guild = require( "./../Schema/guildSchema" );
const fs = require("fs");
const config = require("../Config/config.json");
const Sentry = require("@sentry/node");
let logFileStream = fs.createWriteStream(config.logFileStreamPath, { flags: "a" });
let streamKonsole = new console.Console(logFileStream, logFileStream, false);
let time = Date.now();
const currentDate = new Date(time).toISOString();

module.exports = new Event("guildCreate", (client, guild, message) => {
	streamKonsole.log(
		`${currentDate} [GUILD EVENT] ${guild.name} (${guild.id}) added Caden-San. Ready on it. Owner should start configuration.`
	);

	const channel = client.channels.cache.find((channel) => channel.id === guild.systemChannelId);

	try {
		// For the test
		return channel.send(
			"Welcome ! To start with me, try c!settings and c!help ! And you should be ready to go~"
		);
	} catch (error) {
		//handle error
		Sentry.captureException(error);
		streamKonsole.error(`${currentDate} => ${error}`);
	}
});
