/** @format */

const Command = require("../../Structures/command")
const mongoose = require("mongoose")
const Guild = require("./../../Schema/guildSchema")
const Discord = require("discord.js")

module.exports = new Command({
   name: "settings",
   description: "Get ready with me !",
   type: "TEXT",
   guildOnly: true,
   usage: "c!settings",
   permission: "ADMINISTRATOR",
   async run(message, args, client) {
      //settings
      let guildProfile = await Guild.findOne({ guildId: message.guild.id })

      if (!args[1]) {
         let settingEmbed = new Discord.MessageEmbed()
            .setColor("#af4ae9")
            .setTitle(`${message.guild.name}'s settings :`)
            .setAuthor("Caden-San's settings module", "https://i.imgur.com/d51nGSV.png")
            .setThumbnail(`${message.guild.iconURL()}`)
            .setDescription(
               `See the current settings of your guild with me ! You can set a property with the comment "`
            )
         if (guildProfile.prefix) settingEmbed.addField(`Prefix: `, guildProfile.prefix)
         if (guildProfile.muteRoleId) {
            settingEmbed.addField(`Mute Role: `, `<@${guildProfile.muteRoleId}> (${guildProfile.muteRoleId})`)
         } else {
            settingEmbed.addField("Mute Role:", "No mute role set.")
         }
         if (guildProfile.memberDefaultRoleId) {
            settingEmbed.addField(
               `Default Role for new member: `,
               `<@${guildProfile.memberDefaultRoleId}> (${guildProfile.memberDefaultRoleId})`
            )
         } else {
            settingEmbed.addField("Default Role for new member:", "No default role set.")
         }
         if (guildProfile.logChannelId) {
            settingEmbed.addField(`Log Channel: `, `<@${guildProfile.logChannelId}> (${guildProfile.logChannelId})`)
         } else {
            settingEmbed.addField("Log Channel:", "No log channel set.")
         }

         await message.channel.send({ embeds: [settingEmbed] })
      } else {
         if (!["prefix", "muteRoleId", "memberDefaultRoleId", "logChannelId"].includes(args[1]))
            return await message.channel.send("You need to give a valid property to change.")
         if ("prefix" === args[1]) {
            await Guild.findOneAndUpdate({ guildId: message.guild.id }), { prefix: args[1], lastEdited: Date.now() }
            message.channel.send("Successfully updated your custom prefix !")
         }
      }
   },
})
