/** @format */

const Event = require("../Structures/event")

module.exports = new Event("guildMemberAdd", async (client, member) => {
   let guildOfMember = member.guild
   let guildCard = await client.DataBase.fetchGuild(guildOfMember.id)
   if(!guildCard.addons.welcome.enabled) return
   
   const channelId = member.guild.systemChannelId
   const welcomeChannel = member.guild.channels.cache.get(channelId)

   console.log(`[MEMBER EVENT] New member in ${member.guild.name} !`)

   const welcomeMessage = `Welcome <@${member.id}> on our cloud !~`

   welcomeChannel.send(welcomeMessage)
})
