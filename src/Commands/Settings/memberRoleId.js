/** @format */

const Command = require("../../Structures/command")
const mongoose = require("mongoose")
const Discord = require("discord.js")
const fs = require("fs")
const config = require("../../Config/config.json")
require("dotenv").config({ path: "./../../.env" })
let logFileStream = fs.createWriteStream(config.logFileStreamPath, { flags: "a" })
let streamKonsole = new console.Console(logFileStream, logFileStream, false)
let currentDate = Date.now()

module.exports = new Command({
    name: "setMemberRole",
    description: "Set your custom mute role",
    type: "TEXT",
    guildOnly: true,
    usage: "setMemberRole (roleID)",
    permission: "ADMINISTRATOR",
    async run(message, args, client) {
        try {
            if (!args[1])
                return message.reply(
                    "Forgot how to use this command ? Try `c!help setMemberRole` to see how it works."
                )
            let guildData
            if (!guildData) guildData = await client.DataBase.fetchGuild(message.guild.id)
            
            let memberRole = args.slice(1).join(" ")
            
            let fetched = message.guild.roles.cache.find((role) => role.id === args[1])
            
            if (!fetched) {
                return message.channel.send("This Id is not a valid role. Please retry.")
            }
            
            guildData.memberRoleId = memberRole
            await guildData.save()
            
            message.guild.memberRole = memberRole.toLowerCase()
            
            return message.channel.send(`The new member role is : <@&${memberRole}> (${memberRole})`)
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