/** @format */

const Event = require("../Structures/event")
const fs = require( "fs" );
const config = require( "../Config/config.json" );
let logFileStream = fs.createWriteStream(config.logFileStreamPath)
let streamKonsole = new console.Console(logFileStream, logFileStream, false)
let currentDate = Date.now()

module.exports = new Event("guildUnvailable", (client, guild) => {
    streamKonsole.log(
        `${currentDate} !!!====[GUILD WARN] ${guild.name} (${guild.id}) entered unavailable state !!!. Possible server outage !!! Owner : <@${guild.ownerId}>.`
    )
})
