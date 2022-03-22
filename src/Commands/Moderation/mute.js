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
    name: "mute",
    description: "To mute a user for undefined time.",
    permission: "MANAGE_MESSAGES",
    type: "TEXT",
    usage: "mute [user] [reason]",
    guildOnly: true,
    async run(message, args, client) {
        try {
            if (!args[1])
                return message.reply(
                    "Forgot how to use this command ? Try `c!help mute` to see how it works."
                )

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
                    `I can't mute <@${member.id}>. They have Administrator permission !`
                )
            } else if (permission) {
                return message.reply(
                    `I can't mute <@${member.id}>. They may have an higher role than you or than me.`
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
            //let resolved = message.guild.roles.resolve(muteRole)

            let cMuteRole = message.guild.muteRole

            let muteRole = message.guild.roles.cache.find((role) => role.id === cMuteRole)

            if (!muteRole) {
                //Is there a default mute role already ?
                let defaultMuteRole = message.guild.roles.cache.find(
                    (role) => role.name === "muted"
                )
                //start creating one if not
                if (!defaultMuteRole) {
                    defaultMuteRole = await message.guild.roles.create({
                        name: "muted",
                        color: "#010101",
                        permissions: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                        hoist: true,
                        position: 7,
                        mentionable: false,
                    })
                    //assigning default rights to this role
                    message.guild.channels.cache.forEach(async (channel, id) => {
                        await channel.permissionOverwrites.create(
                            defaultMuteRole.id,
                            {
                                SEND_MESSAGES: false,
                                MANAGE_MESSAGES: false,
                                ADD_REACTIONS: false,
                            },
                            0
                        )
                    })
                    console.log(
                        `[ROLE EVENT] Time : ${client.readyAt}. Change successfully applied in ${message.guild.name}'s each channel for ${defaultMuteRole.name} role.`
                    )

                    message.channel.send(
                        "Mute role successfully added ! Please check the permissions of the role and its position!!! If you see something wrong, contact us via the support server or create a ticket on Caden-San's GitHub page."
                    )
                }
                //end of create role
            }

            //checking if the offender is already mute
            if (
                member.roles.cache.some((role) => role.name === "muted") ||
                member.roles.cache.some((role) => role.id === cMuteRole)
            )
                return message.reply("This user is already mute !")

            let defaultMuteRole = message.guild.roles.cache.find((role) => role.name === "muted")

            //catching the reason...
            let reason = args.slice(2, 50).join(" ")
            if (!reason) reason = "No reason was provided."
            //... and giving the role
            if (cMuteRole) {
                await member.roles.add(muteRole)
            } else {
                await member.roles.add(defaultMuteRole)
            }

            message.channel.send(
                `<@${member.id}> has been muted by ${message.author.tag} for undefined time. Reason : ${reason}`
            )
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
