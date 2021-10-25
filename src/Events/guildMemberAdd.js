/** @format */

const Event = require("../Structures/event")

module.exports = new Event("guildMemberAdd", (client, member) => {
   const channelId = member.guild.systemChannelId
   const welcomeChannel = member.guild.channels.cache.get(channelId)

   console.log(`[MEMBER EVENT] New member in ${member.guild.name} !`)

   const welcomeMessage = `Welcome <@${member.id}> on our cloud !~`

   welcomeChannel.send(welcomeMessage)
})
