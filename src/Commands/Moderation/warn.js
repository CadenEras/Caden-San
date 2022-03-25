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
    name: "warn",
    description: "To warn a user",
    permission: "MANAGE_MESSAGES",
    type: "TEXT",
    usage: "warn [user] [reason]",
    guildOnly: true,
    async run(message, args, client) {
        try {
            if (!args[1]) {
                return message.reply(
                    "Forgot how to use this command ? Try `c!help warn` to see how it works.",
                )
            }
            const member =
                message.mentions.members.first() || message.guild.members.cache.get(args[1])
            if (!member) return message.reply("You need to mention someone to use this command.")
            
            //checking if targeted member can be muted
            const admin = member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR, true)
            const permission = member.permissions.has(
                Discord.Permissions.FLAGS.MANAGE_MESSAGES,
                true
            )
            
            if (admin) {
                return message.reply(
                    `I can't warn <@${member.id}>. They have Administrator permission !`
                )
            } else if (permission) {
                return message.reply(
                    `I can't warn <@${member.id}>. They may have an higher role than you or than me.`
                )
            }
            
            //Checking if there is a role registered in the db by the owner of the guild
            let guildCard
            if (!guildCard) {
                guildCard = await client.DataBase.fetchGuild(
                    message.guild.id,
                    message.guild.name,
                    message.guild.systemChannelId,
                    message.guild.joignedAt
                )
            }
            if (!message.guild.muteRole) {
                guildCard = await client.DataBase.fetchGuild(message.guild.id)
                message.guild.muteRole = guildCard.muteRoleId
            }
            
            //catching the reason...
            let reason = args.slice(2, 50).join(" ")
            if (!reason) reason = "No reason was provided."
            
            message.channel.send(
                `<@${member.id}> has been muted by ${message.author.tag} for undefined time. Reason : ${reason}`
            )
        } catch (error) {
            streamKonsole.log(error)
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