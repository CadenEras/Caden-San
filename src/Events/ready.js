/**@format */

const Event = require("../Structures/event")

module.exports = new Event("ready", (client) => {
   console.log(
      `[CLIENT INFO] Time : ${client.readyAt}. Caden is up, logged in as ${client.user.tag} (${client.user.id}), ready on ${client.guilds.cache.size} servers.`
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
