/**@format */

const Discord = require("discord.js")
const moment = require("moment")
const Event = require("../Structures/event")
require("dotenv").config({ path: "./../../.env" }) 
const chalk = require("chalk")
const Commands = require("./../Events/messageCreate")

module.exports = new Event("ready", async(client) => {
   console.log(
      chalk.green.inverse(`[CLIENT INFO] Time : ${client.readyAt}.\n Caden is up, logged in as ${client.user.tag} (${client.user.id}), ready on ${client.guilds.cache.size} servers.`)
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

})
