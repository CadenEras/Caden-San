/** @format */

const Command = require("../../Structures/command")

const Discord = require("discord.js")

module.exports = new Command({
   name: "help",
   description:
      "Display the list of commands if you just type !help or if you type !help command display info about the command!",
   guildOnly: true,
   type: "TEXT",
   cooldown: 5,
   usage: "c!help or !help [command]",
   permission: "SEND_MESSAGES",
   async run(message, args, client) {
      const command = client.commands.find((cmd) => cmd.name == args[1])

      if (!command) {
         const embed1 = new Discord.MessageEmbed()

            .setTitle("Caden-San's Library")
            .setColor("#af4ae9")
            .setDescription("Get all the help you need with me !\n Try `c!help [command]` for more info !")
            .setThumbnail("https://i.imgur.com/ek6dDxa.png")
            .setAuthor("Caden-San's help module", "https://i.imgur.com/ek6dDxa.png")
            .addFields(
               {
                  name: "Utilities",
                  value: "`help` `server-info` `user-info` `about` `ping`",
               },
               {
                  name: "Moderation :",
                  value: "`ban` `unban` `Kick` `mute` `unmute` `clear`",
               }
            )
            .setTimestamp()
            .setFooter("Made By CadenEras#1919, with love <3")

         await message.channel.send({ embeds: [embed1] })
      } else if (command != undefined) {
         /* fs.readFile(__dirname + '/../../../config/commands_library.json', (err, dataJson) => {  
                if (err) throw err;
                let commands_library = JSON.parse(dataJson);
                let commandName = command[1];*/

         try {
            const embed2 = new Discord.MessageEmbed()

               .setTitle("Cadens-San's Library")
               .setColor("#af4ae9")
               .setDescription("Get all the help you need with me !")
               .setThumbnail("https://i.imgur.com/ek6dDxa.png")
               .setAuthor("Caden-San's help module", "https://i.imgur.com/ek6dDxa.png")
               .addField(
                  `Command: $${command.name}`,
                  `Description: ${command.description}\n` +
                     `Usage: ${command.usage}\n` +
                     `Permission needed: ${command.permission}\n`
               )
               .setTimestamp()
               .setFooter("Made By CadenEras#2020, with love <3")

            message.channel.send({ embeds: [embed2] })
         } catch (error) {
            console.log(error)
            message.channel.send(
               `Something went wrong... You should report that in my maintenance server with the following log. Stack error log : ${error}`
            )
         }
      }
   },
})
