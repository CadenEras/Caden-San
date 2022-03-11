/**@format */

const config = require("./../Config/config.json")
const chalk = require("chalk")
const Event = require("./../Structures/event")
const fs = require( "fs" );
let logFileStream = fs.createWriteStream(config.logFileStreamPath)
let streamKonsole = new console.Console(logFileStream, logFileStream, false)
let currentDate = Date.now()

module.exports = new Event("guildMemberRemove", async (client, member) => {
    //test line
    streamKonsole.log(`${currentDate} [MEMBER EVENT] Member removed in ${member.guild.name} .`)
})
