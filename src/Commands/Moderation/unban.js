/** @format */

const Command = require("../../structures/command")
require("dotenv").config({ path: "./../../.env" })

module.exports = new Command({
   name: "unban",
   description: "To unban a member with their ID.",
   permission: "BAN_MEMBERS",
   usage: "unban [userID]",
   type: "TEXT",
   guildOnly: true,
   async run(message, args, client) {
      try {
         if (!args[1]) return message.reply("Forgot how to use this command ? Try `c!help mute` to see how it works.")
         const userID = args[1]
         
         message.guild.bans.fetch().then((bans) => {
            //Checking if there is a ban list in the server
            if (bans.size === 0) return message.reply("It appear that this guild does not have any banned user...")
   
            //Checking if the user was really banned of the server...
            const bannedUser = bans.find((banned) => banned.user.id === userID)
            if (!bannedUser) return message.reply("This user does not seem to have been banned...")
            
            //...then unban the user
            message.guild.members.unban(bannedUser.user)
            message.channel.send(`<@${userID}> (${userID})has been successfully unban by ${message.author.tag}!`)
         })
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
