/**@format */

const Discord = require("discord.js")
const Event = require("../Structures/event")
require("dotenv").config({ path: "./../../.env" })
const Commands = require("./../Events/messageCreate")
const job = require("./../Config/cronjobs")
const fs = require( "fs" );
const config = require( "../Config/config.json" );
let logFileStream = fs.createWriteStream(config.logFileStreamPath)
let streamKonsole = new console.Console(logFileStream, logFileStream, false)

module.exports = new Event("ready", async (client) => {
    streamKonsole.log(
        `[CLIENT INFO] Time : ${client.readyAt}.\n Caden is up, logged in as ${client.user.tag} (${client.user.id}), ready on ${client.guilds.cache.size} servers.`
    )
    
    console.log(
        `[CLIENT INFO] Time : ${client.readyAt}.\n Caden is up, logged in as ${client.user.tag} (${client.user.id}), ready on ${client.guilds.cache.size} servers.`
    )

    client.user.setPresence({
        activities: [
            {
                name: "c!help",
                type: "PLAYING",
            },
        ],
        status: "online",
    })
    //job.start(client)
})
