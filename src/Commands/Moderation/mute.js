/** @format */

const Discord = require("discord.js")
const Command = require("../../structures/command")

module.exports = new Command({
   name: "mute",
   description: "To mute a user for undefined time.",
   permission: "MANAGE_MESSAGES",
   type: "TEXT",
   usage: "c!mute [user] [reason]",
   guildOnly: true,
   async run(message, args, client) {
      try {
         const member = message.mentions.members.first() || message.guild.members.cache.get(args[1])

         if (!member) return message.reply("You need to mention someone to use this command.")

         const admin = message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR, true)
         const permission = member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES, true)

         if (!admin) {
            if (permission)
               return message.reply("I can't mute this user ! Maybe they have an higher role than you or than me !")
         }
         let muteRole = message.guild.roles.cache.find((role) => role.name === "muted")

         //start of create role
         if (!muteRole) {
            muteRole = await message.guild.roles.create({
               name: "muted",
               color: "#000000",
               permissions: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
               hoist: true,
               position: 7,
               mentionable: false,
            })
            message.guild.channels.cache.forEach(async (channel, id) => {
               await channel.permissionOverwrites
                  .create(
                     muteRole.id,
                     {
                        SEND_MESSAGES: false,
                        MANAGE_MESSAGES: false,
                        ADD_REACTIONS: false,
                     },
                     0
                  )
                  .then((channel) =>
                     console.log(
                        `[ROLE EVENT] Time : ${client.readyAt}. Change successfully applied in <#${channel.id}> from ${message.guild.name} for ${muteRole.name} role !!!`
                     )
                  )
            })

            message.channel.send(
               "Mute role succesfully added ! Please check the permissions of the role !!! If you see something wrong, contact us via the support server !!!"
            )
         }
         //end of create role

         if (member.roles.cache.some((role) => role.name === "muted"))
            return message.reply("This user is already mute !")

         let reason = args.slice(2).join(" ")
         if (!reason) reason = "No reason was provided."

         await member.roles.add(muteRole)
         message.channel.send(
            `<@${member.id}> has been muted by ${message.author.tag} for undefined time. Reason : ${reason}`
         )
      } catch (error) {
         console.log(error)
         message.channel.send(
            `Something went wrong... You should report that in my maintenance server with the following log. Stack error log : ${error}`
         )
      }
   },
})
