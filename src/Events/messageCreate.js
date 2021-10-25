/**@format */

const Discord = require("discord.js")
const Event = require("../Structures/event")
const mongoose = require("mongoose")
const Guild = require("./../Schema/guildSchema")
//const { config } = require("../../node_modules/dotenv/types")
const config = require("./../Config/config.json")
//const talkedRecently = new Set()

module.exports = new Event("messageCreate", (client, message) => {
   let guildProfile = Guild.findOne({guildId: message.guildId})
      if (!guildProfile) {
         console.log(`!!!===[DB Event]guildprofile not found for "${message.guildId}" (${message.guild.name}). Database should be verified.`)
         
      }

   if (message.guild)
      console.log(
         `${message.author.tag} in #${message.channel.name} from ${message.guild.name} sent a message. Message content : "${message.content}"`
      )

   if (message.author.bot) return

   if (!message.content.startsWith(config.prefix)) return

   const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
   //const arg = args.shift().toLowerCase();

   const command = client.commands.find((cmd) => cmd.name == args[0])

   if (!command) return

   if (command.guildOnly && message.channel.type === "dm") {
      return message.reply("I can't execute that command inside DMs!")
   }

   const permission = message.member.permissions.has(command.permission, true)
   if (!permission) {
      return message.reply("Oops ! It seems that you are trying to override your permission !")
   }

   //giving cooldown if command have that settled

   /*if (talkedRecently.has(message.author.id)) {
    message.channel.send('Hey ! Not that fast ! You need to wait 10 more seconds.')
  } else {*/
   //try command here
   try {
      command.run(message, args, client)
   } catch (error) {
      //handle error
      console.error(error)
      return message.reply(
         `Something went wrong... You should report that in my maintenance server with the following log. Stack error log : ${error}`
      )
   }
   //}

   /*talkedRecently.add(message.author.id)
  setTimeout(() => {
    talkedRecently.delete(message.author.id)
  }, 10000)*/
})
