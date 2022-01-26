/**@format */

const Discord = require("discord.js")
const Event = require("../Structures/event")
const mongoose = require("./../DataBase/mongoose")
const config = require("./../Config/config.json")
require("dotenv").config({ path: "./../../.env"}) 
//const talkedRecently = new Set()

module.exports = new Event("messageCreate", async(client, message) => {
   
   if (message.guild)
      console.log(
         `${message.author.tag} in #${message.channel.name} from ${message.guild.name} sent a message. Message content : "${message.content}"`
      )

   if (message.author.bot) return
   if (!message.guild) return

   let guildCard
   if (!guildCard) {
      guildCard = await client.DataBase.fetchGuild(message.guild.id, message.guild.name, message.guild.systemChannelId)
   }
   if(!message.guild.prefix){
      guildCard = await client.DataBase.fetchGuild(message.guild.id)
      message.guild.prefix = guildCard.prefix.toLowerCase()
   }

   let userData
   if (!userData) userData = await client.DataBase.fetchUser(message.author.id)
   

   let memberData
   if (!memberData) memberData = await client.DataBase.fetchMember(message.author.id, message.guild.id)

   let prefix = message.guild.prefix

   if (message.content === `<@!${message.client.user.id}>` || message.content === `<@${message.client.user.id}>`) {
      return message.reply(`Forgot how to use me ? My prefix is \`${prefix}\` ! Use \`${prefix}help\` to find all you need about me !`)
   }

   if (!message.content.startsWith(prefix)) return

   const args = message.content.slice(prefix.length).trim().split(/ +/g)
   //const arg = args.shift().toLowerCase();

   const command = client.commands.find((cmd) => cmd.name == args[0])

   if (!command){
      return
   } else {
      console.log(`${command.name} found`)
   }

   /*if (command.guildOnly && message.channel.type === "dm") {
      return message.reply("I can't execute that command inside DMs!")
   }*/

   const permission = message.member.permissions.has(command.permission, true)
   if (!permission) {
      console.log(`[Command Logger] ${Date.now}\nFrom : ${message.guild.id}, User ${message.author} used ${command.name} but missed somes permissions`)
      return message.reply("Oops ! It seems that you are trying to override your permission !")
   }

   //giving cooldown if command have that settled

   /*if (talkedRecently.has(message.author.id)) {
    message.channel.send('Hey ! Not that fast ! You need to wait 10 more seconds.')
  } else {*/
   
   let data = {}
   data.user = userData
   data.member = memberData
   data.guild = guildCard

   //try command here
   try {
      command.run(message, args, client, data)
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
