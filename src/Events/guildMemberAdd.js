/** @format */

const Event = require("../Structures/event")

module.exports = new Event("guildMemberAdd", (client, member) => {
   const channelId = "872136555626647662"
   const welcomeChannel = member.guild.channels.cache.get(channelId)

   console.log(`[MEMBER EVENT] New member in ${member.guild.name} !`)

   const welcomeMessage = `Welcome <@${member.id}> on our cloud !~`

   welcomeChannel.send(welcomeMessage)
})
