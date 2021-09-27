/** @format */

const Event = require("../Structures/event")

module.exports = new Event("guildCreate", (client, guild) => {
   console.log(`[GUILD INFO] ${guild.name} (${guild.id}) added Caden-San. Owner : <@${guild.ownerId}>. Ready on it.`)

   //starting configuration
})
