/** @format */

const Command = require("../../Structures/command")
require("dotenv").config({ path: "./../../.env" })

const Discord = require("discord.js")


module.exports = new Command({
   name: "about",
   description: "Get information about Caden-San V3",
   type: "TEXT",
   guildOnly: true,
   cooldown: 5,
   usage: "c!about",
   permission: "SEND_MESSAGES",
   async run(message, args, client) {
      try {
         let totalSeconds = (client.uptime / 1000)
         let days = Math.floor(totalSeconds / 86400)
         let hours = Math.floor(totalSeconds / 3600)
         totalSeconds %= 3600
         let minutes = Math.floor(totalSeconds / 60)
         let seconds = totalSeconds % 60

         let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`

         const channelDev = client.channels.cache.find(channel => channel.id === process.env.BASEDEVLOGCHANNELID)
         const embed1 = new Discord.MessageEmbed()
            .setTitle("Caden-San")
            .setColor("#af4ae9")
            .setDescription("Hi ! I'm Caden-San, a moderation bot created by CadenEras ! Try `c!help` to start with me !")
            .setAuthor("Caden-San V3", "https://i.imgur.com/ek6dDxa.png")
            .addField(`Art by`, `Opheliart#3547 (633310607730278402)`)
            .addField(`Language`, `JavaScript`, true)
            .addField(`Prefix`, `c!`, true)
            .addField(`Owner`, `CadenEras#2020 (795326819346808832)`, true)
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
            .setImage("https://i.imgur.com/ek6dDxa.png")
            .setTimestamp()
            .setFooter("Made By CadenEras#2020, with love <3")

         await channelDev.messages.fetch('899636465598889995')
         .then((msg) => {
            setTimeout(function(){
               msg.edit({ embeds: [embed1]})
            }, 30000)
         })
      } catch (error) {
         console.log(error)
         message.channel.send(
            `Something went wrong... You should report that in my maintenance server with the following log. Stack error log : ${error}`
         )
      }
   },
})
