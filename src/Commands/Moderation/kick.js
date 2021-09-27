/** @format */

const Command = require("../../structures/command")

module.exports = new Command({
   name: "kick",
   description: "Kick an user from the server.",
   usage: "c!kick [user] [reason]",
   type: "TEXT",
   guildOnly: true,
   permission: "KICK_MEMBERS",
   async run(message, args, client) {
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[1])

      if (!member)
         //you have to type !kick then @username#1234 as an example
         return message.reply("Please mention a valid member of this server !")
      if (!member.kickable) return message.reply("I cannot kick this user! Do they have a higher role?")

      // slice(1) removes the first part, which here should be the user mention or ID
      // join(' ') takes all the various parts to make it a single string.
      const reason = args.slice(2, 20).join(" ")
      if (!reason) reason = "No reason was provided."

      try {
         await member.kick()
         message.channel.send(`${member.user.tag} has been kicked by ${message.author.tag}. Reason: ${reason}`)
      } catch (error) {
         console.log(error)
         message.channel.send(
            `Something went wrong... You should report that in my maintenance server with the following log. Stack error log : ${error}`
         )
      }
   },
})
