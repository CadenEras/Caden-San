/**@format */

const config = require("./../Config/config.json");
const Event = require("./../Structures/event");
const fs = require("fs");
const Sentry = require("@sentry/node");
let logFileStream = fs.createWriteStream(config.logFileStreamPath, { flags: "a" });
let streamKonsole = new console.Console(logFileStream, logFileStream, false);
let time = Date.now();
const currentDate = new Date(time).toISOString();

module.exports = new Event("guildMemberRemove", async (client, member) => {
	//todo: to make
	//console.log(`${currentDate} [MEMBER EVENT] Member removed in ${member.guild.name} .`)
});
