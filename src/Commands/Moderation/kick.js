/** @format */

const Command = require("../../structures/command")
const Discord = require( "discord.js" );
require("dotenv").config({ path: "./../../.env" })

module.exports = new Command({
   name: "kick",
   description: "Kick an user from the server.",
   usage: "kick [user] [reason]",
   type: "TEXT",
   guildOnly: true,
   permission: "KICK_MEMBERS",
   async run(message, args, client) {
      try {
         if (!args[1]) return message.reply("Forgot how to use this command ? Try `c!help mute` to see how it works.")
         
         const offender = message.mentions.members.first() || message.guild.members.cache.get(args[1])
         if (!offender) return message.reply("You need to mention someone to use this command.")
      
         //Check if the offender is actually kickable (check if the user is manageable and if you have Ban Members Permission)
         if (!offender.kickable) {
            return message.channel.send(
                `I cannot ban ${offender.user.username}! Their role is maybe higher or i don't have ban permission here...`
            )
         }
         
         //Catching the reason...
         let reason = args.slice( 2, 50 ).join(" ")
         if (!reason) reason = "No reason was provided."
         
         //...creating the case...
         const banEmbed = new Discord.MessageEmbed()
             .setAuthor("Caden-San's Moderation module", "https://i.imgur.com/ek6dDxa.png")
             .setTitle("Kick Case")
             .addField(
                 `\`Offender :\` ${offender.user.tag} (${offender.user.id})`,
                 `\`Reason :\` ${reason}\n\`Moderator :\` ${message.author.tag} (${message.author.id})`
             )
             .setColor("#ff8000")
             .setThumbnail(`${offender.user.displayAvatarURL({ dynamic: true })}`)
             .setTimestamp()
   
         message.channel.send({ embeds: [banEmbed] })
         
         //...then kick the offender
         //await offender.kick()
   
         //Sending a private message to the offender
         await offender.user.send(`You've been kicked from ${message.guild.name} for ${reason} by ${message.author.tag}.`)
      } catch (error) {
         console.log(error)
         const channelDev = client.channels.cache.find(channel => channel.id === process.env.BASEDEVLOGCHANNELID)
         channelDev.channel.send(
             `An Error occurred in ${message.guild.name} (${message.guild.id}). Stack error log : ${error}`
         )
         message.channel.send("Something went wrong... If this error keeps occurring, please report it in the maintenance server.")
      }
   },
})
