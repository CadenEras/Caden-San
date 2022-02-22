/** @format */

const Command = require("../../Structures/command")
const mongoose = require("mongoose")
const Discord = require("discord.js")
require("dotenv").config({ path: "./../../.env" })

module.exports = new Command({
   name: "setMuteRole",
   description: "Set your custom mute role",
   type: "TEXT",
   guildOnly: true,
   usage: "setMuteRole (roleID)",
   permission: "ADMINISTRATOR",
   async run(message, args, client) {
       try{
           if (!args[1]) return message.reply("Forgot how to use this command ? Try `c!help setMuteRole` to see how it works.")
        let guildData;
        if (!guildData) guildData = await client.DataBase.fetchGuild(message.guild.id)

        let muteRole = args.slice(1).join(" ")
        guildData.muteRoleId = muteRole
        await guildData.save();

        message.guild.muteRole = muteRole.toLowerCase()

        return message.channel.send(`The new mute role is : \`<@${muteRole}>\` (${muteRole})`)
       } catch(error) {
           console.log(error)
           const channelDev = client.channels.cache.find(channel => channel.id === process.env.BASEDEVLOGCHANNELID)
           channelDev.channel.send(
               `An Error occurred in ${message.guild.name} (${message.guild.id}). Stack error log : ${error}`
           )
           message.channel.send("Something went wrong... If this error keeps occurring, please report it in the maintenance server.")
       }
   },
})