/** @format */

const Command = require("../../structures/command")
const fs = require("fs")
const config = require("../../Config/config.json")
require("dotenv").config({ path: "./../../.env" })
let logFileStream = fs.createWriteStream(config.logFileStreamPath, { flags: "a" })
let streamKonsole = new console.Console(logFileStream, logFileStream, false)
let currentDate = Date.now()

module.exports = new Command({
    name: "unmute",
    description: "To unmute a user.",
    permission: "MUTE_MEMBERS",
    usage: "unmute [user]",
    type: "TEXT",
    guildOnly: true,
    async run(message, args, client) {
        try {
            if (!args[1])
                return message.reply(
                    "Forgot how to use this command ? Try `c!help unmute` to see how it works."
                )
            
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
            //let resolved = message.guild.roles.resolve(muteRole)
            
            let cMuteRole = message.guild.muteRole
            let muteRoleDB = message.guild.roles.cache.find((role) => role.id === cMuteRole)
            
            //Catching the mentioned offender
            const toUnmute =
                message.mentions.members.first() || message.guild.members.cache.get(args[1])
            if (!toUnmute) return message.reply("You need to mention someone to use this command.")
            
            //Checking if the offender is actually muted
            const muteRole = message.guild.roles.cache.find((role) => role.name === "muted")
            if (
                !toUnmute.roles.cache.some((role) => role.name === "muted") &&
                !toUnmute.roles.cache.some((role) => role.id === cMuteRole)
            )
                return message.reply("This user is not mute !")
            
            //Removing the role...
            if (cMuteRole) {
                await toUnmute.roles.remove(muteRoleDB)
            } else {
                await toUnmute.roles.remove(muteRole)
            }
            
            message.channel.send(`<@${toUnmute.id}> has been unmuted by ${message.author.tag}.`)
        } catch (error) {
            streamKonsole.log(error)
            const channelDev = client.channels.cache.find(
                (channel) => channel.id === process.env.BASEDEVLOGCHANNELID
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