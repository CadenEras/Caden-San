/** @format */

const Command = require('../../structures/command')

module.exports = new Command({
  name: 'unban',
  description: 'To unban a member with their ID.',
  permission: 'BAN_MEMBERS',
  usage: 'c!unban [userID]',
  type: 'TEXT',
  guildOnly: true,
  async run(message, args, client) {
      try {

        const userID = args[1]

        message.guild.bans.fetch().then((bans) => {
            if (bans.size == 0) return message.reply('Hey ! This user seem to be not banned...')
            
            const bannedUser = bans.find((banned) => banned.user.id == userID)
            if (!bannedUser) return message.reply('I did not found this user...')
            
            message.guild.members.unban(bannedUser.user)
            message.channel.send(`<@${userID}> (${userID})has been successfully unban by ${message.author.tag}!`)
        })
      } catch (error) {
        console.log(error)
        message.channel.send(
          `Something went wrong... You should report that in my maintenance server with the following log. Stack error log : ${error}`
        )
      }
    
  },
})