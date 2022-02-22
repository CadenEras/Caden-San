/** @format */

const Command = require("../../Structures/command")
require("dotenv").config({ path: "./../../.env" })

module.exports = new Command({
   name: "clear",
   description: "Delete an amount of messages, the number must be between 1 and 100",
   type: "TEXT",
   guildOnly: true,
   permission: "MANAGE_MESSAGES",
   usage: "clear [number]",
   async run(message, args, client) {
      try {
         if (!args[1]) return message.reply("Forgot how to use this command ? Try `c!help clear` to see how it works !")
         const deleteCount = args[1]
   
         if (!deleteCount || isNaN(deleteCount)) {
            return message.reply("Please provide a valid number.")
         }
   
         const countParsed = parseInt(deleteCount)
   
         if (countParsed > 100) {
            return message.reply("Hey ! I cannot delete more than 100 messages at the same time. Retry with a valide amount between 1 and 100.")
         }
   
         if (countParsed < 1) {
            return message.reply("Hey ! Are you to create a black hole ?  Retry with a valide number between 1 and 100!")
         }
         
         await message.channel.bulkDelete(countParsed)
         const replyDelete = await message.channel.send(`I cleared ${countParsed} messages in #${message.channel.name} !`)

         setTimeout(() => replyDelete.delete(), 4000)
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
