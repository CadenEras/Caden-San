/** @format */

const Discord = require("discord.js")
const Command = require("../../structures/command")
const fs = require("fs")
const config = require("../../Config/config.json")
require("dotenv").config({ path: "./../../.env" })
let logFileStream = fs.createWriteStream(config.logFileStreamPath, { flags: "a" })
let streamKonsole = new console.Console(logFileStream, logFileStream, false)
let currentDate = Date.now()

module.exports = new Command({
    name: "msg",
    description: "Sending message via V-Soho",
    type: "TEXT",
    usage: "msg [channel] [msg]",
    permission: "ADMINISTRATOR",
    async run(message, args, client) {
        try {
            if ( message.author.id !== config.ownerID ) {
                return
            }
            
            if ( !args[1] ) {
                return message.reply(
                    "Forgot how to use this command ? Try `c!help mute` to see how it works."
                )
            }
            
            const validChannel = message.guild.channels.cache.get(args[1])
            //const validChannel = client.channels.cache.find((channel) => channel.id === args[1])
            if(!validChannel) {
                return message.reply("This is not a valid channel ! Please retry.")
            }
            
            const msgToSend = args.slice(2, 3500).join(" ")
            if(!msgToSend) return message.reply(
                "You need to provide a message whose length is at least 2 and at most 3500 characters."
            )
            
            await validChannel.send(msgToSend)
            
        } catch (error) {
            streamKonsole.log(`${currentDate} : ${error}`)
            const channelDev = client.channels.cache.find(
                (channel) => channel.id === config.DevLogChannelId
            )
            channelDev.channel.send(
                `An Error occurred in ${message.guild.name} (${message.guild.id}). Stack error log : ${error}`
            )
            message.channel.send(
                "Something went wrong... If this error keeps occurring, please report it in the maintenance server."
            )
        }
    },
})