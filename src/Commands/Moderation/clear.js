/** @format */

const Command = require("../../Structures/command")

module.exports = new Command({
   name: "clear",
   description: "Delete an amount of messages, the number must be between 1 and 100",
   type: "TEXT",
   guildOnly: true,
   permission: "MANAGE_MESSAGES",
   usage: "c!clear [number]",
   async run(message, args, client) {
      const deleteCount = args[1]

      if (!deleteCount || isNaN(deleteCount)) {
         return message.reply("Please provide a valid number between 1 and 100 !")
      }

      const countParsed = parseInt(deleteCount)

      if (countParsed > 100) {
         return message.reply("Hey ! I cannot delete more than 100 messages at the same time !")
      }

      if (countParsed < 1) {
         return message.reply("Hey ! Are you to create a black hole ?  Retry with a valide number between 1 and 100!")
      }

      try {
         await message.channel.bulkDelete(countParsed)
         const replyDelete = await message.channel.send(`I cleared ${countParsed} messages in #${message.channel.name}`)

         setTimeout(() => replyDelete.delete(), 4000)
      } catch (error) {
         console.log(error)
         message.channel.send(
            `Something went wrong... You should report that in my maintenance server with the following log. Stack error log : ${error}`
         )
      }
   },
})
