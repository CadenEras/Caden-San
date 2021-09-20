/** @format */

const Command = require('../../Structures/command')

const Discord = require('discord.js')

module.exports = new Command({
  name: 'ping',
  description: 'Get the bot response time !',
  type: 'TEXT',
  guildOnly: true,
  usage: 'c!ping',
  permission: 'SEND_MESSAGES',
  async run(message, args, client) {
    await message.channel.send(
      `pong ! I'm alive ! ${Math.round(client.ws.ping)} ms, ${Date.now() - message.createdTimestamp} ms.`
    )
  },
})