/** @format */

const Command = require("../../Structures/command")
const mongoose = require("mongoose")
const UserP = require("../../Schema/userSchema")
const Discord = require("discord.js")

const defaultPrefix = "c!"

module.exports = new Command({
   name: "userP",
   description: "Get ready with me !",
   type: "TEXT",
   guildOnly: true,
   usage: "c!settings",
   permission: "ADMINISTRATOR",
   async run(message, args, client) {
      const userMe = message.author

      
         const userProfile = await new UserP({
            _id: mongoose.Types.ObjectId(),
            userId: userMe.id,
            userName: userMe.username,
            createdAt: userMe.createdAt
         })
         await userProfile.save()
         .then(result => console.log(result))
         .catch(err => console.log(err))

         await message.channel.send(`There is the name ${userMe.name}`)

   },
})