/** @format */

const Command = require("../../structures/command")
const Discord = require("discord.js")

module.exports = new Command({
   name: "ban",
   description: "Ban an user from the server with a reason",
   type: "TEXT",
   guildOnly: true,
   permission: "BAN_MEMBERS",
   usage: "c!ban [user] [reason]",
   async run(message, args, client) {
      try {
         const member = message.mentions.members.first() || message.guild.members.cache.get(args[1])

         if (!member) return message.channel.send("Please mention a valid member of this server !")
         if (!member.bannable)
            return message.channel.send(
               `I cannot ban ${member.user.username}! Their role is maybe higher or i don't have ban permission here...`
            )

         let reason = args.slice(2, 20).join(" ")
         if (!reason) reason = "No reason was provided."

         const banEmbed = new Discord.MessageEmbed()
            .setAuthor("Caden-San's Moderation module", "https://i.imgur.com/ek6dDxa.png")
            .setTitle("Ban Case")
            .addField(
               `\`Offender :\` ${member.user.tag} (${member.user.id})`,
               `\`Reason :\` ${reason}\n\`Moderator :\` ${message.author.tag} (${message.author.id})`
            )
            .setColor("#ff0000")
            .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp()

         message.channel.send({ embeds: [banEmbed] })

         //await member.ban({ reason: reason })

         await member.user.send(`You've been banned from ${message.guild.name} for ${reason} by ${message.author.tag}.`)
      } catch (error) {
         console.log(error)
         message.channel.send(
            `Something went wrong... You should report that in my maintenance server with the following log. Stack error log : ${error}`
         )
      }
   },
})
