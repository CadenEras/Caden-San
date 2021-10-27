/**@format */

const Discord = require("discord.js")
const moment = require("moment")
const Event = require("../Structures/event")
require("dotenv").config({ path: "./../../.env" }) 
const chalk = require("chalk")

module.exports = new Event("ready", (client) => {
   console.log(
      chalk.green.inverse(`[CLIENT INFO] Time : ${client.readyAt}. Caden is up, logged in as ${client.user.tag} (${client.user.id}), ready on ${client.guilds.cache.size} servers.`)
   )

   client.user.setPresence({
      activities: [
         {
            name: "c!help",
            type: "PLAYING",
         },
      ],
      status: "online",
   })
   //Use this to monitor in real-time the bot in your server, replace it by your channel id
   const channelDev = client.channels.cache.find(channel => channel.id === process.env.BASEDEVLOGCHANNELID)

   try {
      let totalSeconds = (client.uptime / 1000)
      let days = Math.floor(totalSeconds / 86400)
      let hours = Math.floor(totalSeconds / 3600)
      totalSeconds %= 3600
      let minutes = Math.floor(totalSeconds / 60)
      let seconds = totalSeconds % 60

      let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`

      const embed1 = new Discord.MessageEmbed()
         .setTitle("Caden's-San V3")
         .setColor("#af4ae9")
         .setDescription("Hi ! I'm Caden-San V3, the first bot of Vinnie ! Try `c!help` to start with me !")
         .setThumbnail("https://i.imgur.com/d51nGSV.png")
         .setAuthor("Caden-San V3", "https://i.imgur.com/d51nGSV.png")
         .addField(`Language`, `JavaScript`, true)
         .addField(`Prefix`, `c!`, true)
         .addField(`Owner`, `Vinnie#2020 (795326819346808832)`, true)
         .addField(`Creation date`, `July 2021`, true)
         .addField(`Maintenance Server`, `https://discord.gg/W6epQx8YHR`, true)
         .addField(`Repository (GitHub)`, `https://github.com/CadenEras/Caden_San`, true)
         .addField(`Node version`, `${process.version} on ${process.platform} ${process.arch}`, true)
         .addField(
            `Memory usage`,
            `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(
               process.memoryUsage().heapUsed /
               1024 /
               1024
            ).toFixed(2)} MB Heap.`,
            true
         )
         .addField(`Uptime`, `${uptime}`, true)
         .setTimestamp()
         .setFooter("Made By Vinnie#2020, with love <3")

      
      channelDev.messages.fetch('899636465598889995')
      .then((msg) => {
         setTimeout(function(){
            msg.edit({ embeds: [embed1]})
         }, 30000)
      })

   } catch (error) {
      console.log(error)
      channelDev.send(
         `Something went wrong... You should report that in my maintenance server with the following log. Stack error log : ${error}`
      )
   }
})
