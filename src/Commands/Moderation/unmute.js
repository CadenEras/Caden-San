/** @format */

const Command = require('../../structures/command')

module.exports = new Command({
  name: 'unmute',
  description: 'To unmute a user.',
  permission: 'MUTE_MEMBERS',
  usage: 'c!unmute [user]',
  type: 'TEXT',
  guildOnly: true,
  async run(message, args, client) {
    
    try {
      const toUnmute = message.mentions.members.first() || message.guild.members.cache.get(args[1])
      if (!toUnmute) return message.reply("I've searched everywhere and i couldn't find this user!")
      const muterole = message.guild.roles.cache.find((role) => role.name === 'muted')

      if (!toUnmute.roles.cache.some((role) => role.name === 'muted')) return message.reply("This user is not mute !")
      await toUnmute.roles.remove(muterole)
      message.channel.send(`<@${toUnmute.id}> has been unmuted by ${message.author.tag}`)

    } catch (error) {
      console.log(error)
      message.channel.send(
        `Something went wrong... You should report that in my maintenance server with the following log. Stack error log : ${error}`
      )
    }
  },
})