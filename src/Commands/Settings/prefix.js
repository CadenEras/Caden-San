/** @format */

const Command = require("../../Structures/command")
const mongoose = require("mongoose")
const UserP = require("../../Schema/userSchema")
const Discord = require("discord.js")
const fs = require("fs")
const config = require("../../Config/config.json")
require("dotenv").config({ path: "./../../.env" })
let logFileStream = fs.createWriteStream(config.logFileStreamPath, { flags: "a" })
let streamKonsole = new console.Console(logFileStream, logFileStream, false)
let currentDate = Date.now()

const defaultPrefix = "c!"

module.exports = new Command({
    name: "prefix",
    description: "Set a new prefix",
    type: "TEXT",
    guildOnly: true,
    usage: "c!prefix",
    permission: "ADMINISTRATOR",
    async run(message, args, client) {
        try {
            if (!args[1])
                return message.reply(
                    "Forgot how to use this command ? Try `c!help prefix` to see how it works."
                )
            let guildData
            if (!guildData) guildData = await client.DataBase.fetchGuild(message.guild.id)

            let prefix = args.slice(1).join(" ")
            guildData.prefix = prefix
            await guildData.save()

            message.guild.prefix = prefix.toLowerCase()

            return message.channel.send(`The new prefix is : \`${prefix}\``)
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
