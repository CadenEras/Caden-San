/** @format */

const Command = require("../../Structures/command")

const Discord = require("discord.js")
const moment = require("moment")

module.exports = new Command({
   name: "user-info",
   description: "Shows the author of the message or the mentioned user, their informations!",
   guildOnly: true,
   type: "TEXT",
   cooldown: 5,
   usage: "c!user-info or !user-info [user mention]",
   permission: "SEND_MESSAGES",
   async run(message, args, client) {
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member

      var acknowledgements = "none"
      const admin = member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR, true)

      if (member.id === message.guild.ownerId) {
         acknowledgements = "Server Owner"
      } else if (admin) {
         acknowledgements = "Server Administrator"
      } else {
         acknowledgements = "Simple Member"
      }

      const infoEmbed = new Discord.MessageEmbed()

         .setTitle("Here is your information :")
         .setColor("#af4ae9")
         .setDescription(`Your username : ${member.user.username}\nYour ID : ${member.user.id}\n`)
         .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
         .setAuthor(`${message.author.username}`, `${member.user.displayAvatarURL({ dynamic: true })}`)
         .addField("Joined this server on: ", `${moment(member.joinedAt).format("dddd, MMMM Do YYYY")}`, true)
         .addField("Created at: ", `${moment(member.user.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss")}`, true)
         .addField("Status: ", `${member.presence?.status}`, true)
         .addField("Bannable : ", `${member.bannable}`, true)
         .addField("Kickable : ", `${member.kickable}`, true)
         .addField("Manageable : ", `${member.manageable}`, true)
         .addField("Acknowledgements: ", `${acknowledgements}`, true)
         .addField(
            `Roles [${
               member.roles.cache.filter((r) => r.id !== message.guild.id).map((roles) => `\`${roles.name}\``).length
            }]`,
            `${
               member.roles.cache
                  .filter((r) => r.id !== message.guild.id)
                  .map((roles) => `<@&${roles.id}>`)
                  .join(" **|** ") || "No Roles"
            }`,
            true
         )
         .setTimestamp()
         .setFooter(`Caden-San's info module`)

      await message.channel.send({ embeds: [infoEmbed] })

      //TODO: when a raw id is typed, do not send intel about the user that sended the message, return an error instead

      /*if (!args.length) {
		
		} else {
			const taggedUser = message.mentions.users.first();
			const embed2 = new Discord.MessageEmbed()
		
            .setTitle(`Here is ${taggedUser.username}\'s information :`)
            .setColor('#af4ae9')
            .setDescription(`Username : ${taggedUser.username}\nID : ${taggedUser.id}\n`)
            .setThumbnail(`${taggedUser.displayAvatarURL({dynamic: true})}`)
            .setFooter(`ID: ${message.author.id}`)
            .addField('Joined at: ',`${moment(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss")}`, true)
            .addField("Created at: ",`${moment(taggedUser.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss")}`, true)
            .addField("Acknowledgements: ", `${acknowledgements}`, true)
            .addField(`Roles : [${member.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `\`${roles.name}\``).length}]`,`${member.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `<@&${roles.id }>`).join(" **|** ") || "No Roles"}`, true)
            .setAuthor(`${taggedUser.username}`, `${taggedUser.displayAvatarURL({dynamic: true})}`);
            
            await message.channel.send(embed2);*/
   },
})
