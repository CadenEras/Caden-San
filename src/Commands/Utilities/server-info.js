/** @format */

const Command = require('../../Structures/command')

const Discord = require('discord.js')

module.exports = new Command({
  name: 'server-info',
  description: 'Get information of the current server !',
  guildOnly: true,
  cooldown: 5,
  usage: 'c!server-info',
  permission: 'SEND_MESSAGES',
  async run(message, args, client) {
    try {
      const embed1 = new Discord.MessageEmbed()

        .setTitle(`Here is ${message.guild.name}'s information :`)
        .setColor('#af4ae9')
        .setDescription(
          `Guild's name : ${message.guild.name}\nGuild's ID : ${message.guild.id}\nCreated on : ${message.guild.createdAt}\nMember count : ${message.guild.memberCount}\nOwner <@${message.guild.ownerId}> (${message.guild.ownerId})\n`
        )
        .setThumbnail(`${message.guild.iconURL()}`)
        .setAuthor(`${message.guild.name}`, `${message.guild.iconURL()}`)
        .setTimestamp()

      await message.channel.send({ embeds: [embed1] })
    } catch (error) {
      console.log(error)
      message.channel.send(
        `Something went wrong... You should report that in my maintenance server with the following log. Stack error log : ${error}`
      )
    }
  },
})