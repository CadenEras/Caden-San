/**@format */

const Discord = require("discord.js")
const Event = require("../Structures/event")
//const talkedRecently = new Set()

module.exports = new Event("messageCreate", (client, message) => {
   if (message.guild)
      console.log(
         `${message.author.tag} sent in #${message.channel.name} from ${message.guild.name} sent a message. Message content : "${message.content}"`
      )

   if (message.author.bot) return

   if (!message.content.startsWith(client.prefix)) return

   const args = message.content.slice(client.prefix.length).trim().split(/ +/)
   //const command = args.shift().toLowerCase();

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
