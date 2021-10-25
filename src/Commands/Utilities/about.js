/** @format */
const moment = require("moment")
require("moment-duration-format")
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
         const channelDev = client.channels.cache.find(channel => channel.id === process.env.BASEDEVLOGCHANNELID)
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
            .addField(`Uptime`, `${moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]")}`, true)
            .setTimestamp()
            .setFooter("Made By Vinnie#2020, with love <3")

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
