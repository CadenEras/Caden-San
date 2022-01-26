/** @format */

const Command = require("../../Structures/command")
const mongoose = require("mongoose")
const UserP = require("../../Schema/userSchema")
const Discord = require("discord.js")

const defaultPrefix = "c!"

module.exports = new Command({
   name: "prefix",
   description: "Set a new prefix",
   type: "TEXT",
   guildOnly: true,
   usage: "c!prefix",
   permission: "ADMINISTRATOR",
   async run(message, args, client) {
       try{
        let guildData;
        if (!guildData) guildData = await client.DataBase.fetchGuild(message.guild.id)

        let prefix = args.slice(1).join(" ")
        guildData.prefix = prefix
        await guildData.save();

        message.guild.prefix = prefix.toLowerCase()

        return message.channel.send(`The new prefix is : \`${prefix}\``)
       } catch(error) {
            console.log(`Issue with setting new prefix. Error :\n ${error}`)
       }

   },
})