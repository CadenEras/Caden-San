/** @format */

const Event = require('../Structures/event')

module.exports = new Event('guildUnvailable', (client, guild) => {
  console.log(
    `!!!====[GUILD WARN] ${guild.name} (${guild.id}) entered unavailable state !!!. Possible server outtage !!! Owner : <@${guild.ownerId}>.`
  )
})