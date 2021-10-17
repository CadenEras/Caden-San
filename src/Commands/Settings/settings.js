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

      let guildProfile = await Guild.findOne({guildId: message.guildId})
      if (!guildProfile) {
         console.log(`!!!===[DB Event]guildprofile not found for "${message.guildId}" (${message.guild.name}). Database should be verified.`)
         
      }

      if (!args[1]) {
         let settingEmbed = new Discord.MessageEmbed()
            .setColor("#af4ae9")
            .setTitle(`${message.guild.name}'s settings :`)
            .setAuthor("Caden-San's settings module", "https://i.imgur.com/d51nGSV.png")
            .setThumbnail(`${message.guild.iconURL()}`)
            .setDescription(
               `See the current settings of your guild with me ! You can set a property with the command. You will need to be in developer mod to get  "`
            )
         if (guildProfile.prefix) settingEmbed.addField(`Prefix: `, guildProfile.prefix)
         if (guildProfile.muteRoleId) {
            settingEmbed.addField(`Mute Role: `, `<@${guildProfile.muteRoleId}> (${guildProfile.muteRoleId})`)
         } else {
            settingEmbed.addField("Mute Role:", "No mute role set.")
         }
         if (guildProfile.memberRoleId) {
            settingEmbed.addField(
               `Default Role for new member: `,
               `<@${guildProfile.memberRoleId}> (${guildProfile.memberRoleId})`
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
         if (!["prefix", "muteRoleId", "memberRoleId", "logChannelId"].includes(args[1]))
            return await message.channel.send("You need to give a valid property to change.")
         if ("prefix" === args[1]) {
            await Guild.findOneAndUpdate({ guildId: message.guild.id }, { prefix: args[2], lastEdited: Date.now() })
            message.channel.send("Successfully updated your custom prefix !")
         } else if ("muteRoleId" === args[1]){
            await Guild.findOneAndUpdate({ guildId: message.guild.id }, { muteRoleId: args[2], lastEdited: Date.now() })
            message.channel.send("Successfully updated your muterole !")
         } else if ("memberRoleId" === args[1]){
            await Guild.findOneAndUpdate({guildId: message.guild.id}, { memberRoleId: args[2], lastEdited: Date.now() })
            message.channel.send("Successfully updated your default role for your new members !")
         } else if ("logChannelId" === args[1]){
            await Guild.findOneAndUpdate({guildId: message.guild.id}, { logChannelId: args[2], lastEdited: Date.now() })
            message.channel.send("Successfully updated your default log channel !")
         }
      }
   },
})
