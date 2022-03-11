/** @format */

const Event = require("../Structures/event")
const fs = require( "fs" );
const config = require( "../Config/config.json" );
let logFileStream = fs.createWriteStream(config.logFileStreamPath)
let streamKonsole = new console.Console(logFileStream, logFileStream, false)
let currentDate = Date.now()

module.exports = new Event("guildMemberAdd", async (client, member) => {
    //test line
    streamKonsole.log(`${currentDate} [MEMBER EVENT] New member in ${member.guild.name} !`)
    
    let guildOfMember = member.guild
    let guildCard = await client.DataBase.fetchGuild(guildOfMember.id)
    if (!guildCard.addons.welcome.enabled) return

    const channelId = member.guild.systemChannelId
    const welcomeChannel = member.guild.channels.cache.get(channelId)

    const welcomeMessage = `Welcome <@${member.id}> on our cloud !~`

    welcomeChannel.send(welcomeMessage)
})
