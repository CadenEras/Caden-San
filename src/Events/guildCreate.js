/** @format */

const Event = require("../Structures/event")
const mongoose = require("mongoose")
const Guild = require("./../Schema/guildSchema")
require("dotenv").config({ path: "./../../.env" })

const defaultPrefix = process.env.DEFAULTPREFIX

module.exports = new Event("guildCreate", (client, guild, message) => {
   console.log(`[GUILD EVENT] ${guild.name} (${guild.id}) added Caden-San. Owner : <@${guild.ownerId}>. Ready on it. Owner should start configuration.`)

   //starting default configuration

   const guildProfile = new Guild({
      _id: guild.id,
      guildName: guild.name,
      createdAt: guild.createdAt,
      joignedAt: guild.joinedAt,
      prefix: defaultPrefix,
      muteRoleId: "",
      memberRoleId: "",
      logChannelId: guild.systemChannelId

   })

   guildProfile.save()
   .then(result => console.log(`Successfully created guild profile for ${guild.name} (${guild.id}) and added it to the database:\n`, result))
   .catch(err => console.log(err))

   const channel = client.channels.cache.find(channel => channel.id === guild.systemChannelId)

   try {
      return channel.send("Welcome ! this is a test message !")
   } catch (error) {
      //handle error
      console.error(error)
      return message.reply(
         `Something went wrong... You should report that in my maintenance server with the following log. Stack error log : ${error}`
      )
   }
})
