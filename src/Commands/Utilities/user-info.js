/** @format */

const Command = require( "../../Structures/command" );
const Discord = require( "discord.js" );
const moment = require( "moment" );
const fs = require( "fs" );
const config = require( "../../Config/config.json" );
require( "dotenv" ).config( { path: "./../../.env" } );
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let currentDate = Date.now().toString();

module.exports = new Command( {
	name: "user-info",
	description: "Shows the author of the message or the mentioned user, their informations!",
	guildOnly: true,
	type: "TEXT",
	cooldown: 5,
	usage: "user-info or user-info [user mention]",
	permission: "MANAGE_MESSAGES",
	async run( message, args, client ) {
		try {
			const member =
				message.mentions.members.first() ||
				message.guild.members.cache.get( args[0] ) ||
				message.member;
			
			let acknowledgements = "none";
			const admin = member.permissions.has( Discord.Permissions.FLAGS.ADMINISTRATOR, true );
			
			//Getting member position
			if( member.id === message.guild.ownerId ) {
				acknowledgements = "Server Owner";
			} else if( admin ) {
				acknowledgements = "Server Administrator";
			} else {
				acknowledgements = "Simple Member";
			}
			
			const infoEmbed = new Discord.MessageEmbed()
				
				.setTitle( "Here is your information :" )
				.setColor( member.displayHexColor )
				.setDescription(
					`Your username : ${member.user.username}\nYour ID : ${member.user.id}\n`,
				)
				.setThumbnail( `${member.user.displayAvatarURL( { dynamic: true } )}` )
				.setAuthor(
					`${message.author.username}`,
					`${member.user.displayAvatarURL( { dynamic: true } )}`,
				)
				.addField(
					"Joined this server on: ",
					`${moment( member.joinedAt ).format( "dddd, MMMM Do YYYY" )}`,
					true,
				)
				.addField(
					"Created at: ",
					`${moment( member.user.createdAt ).format( "dddd, MMMM Do YYYY, HH:mm:ss" )}`,
					true,
				)
				.addField( "Status: ", `${member.presence?.status}`, true )
				.addField( "Bannable : ", `${member.bannable}`, true )
				.addField( "Kickable : ", `${member.kickable}`, true )
				.addField( "Manageable : ", `${member.manageable}`, true )
				.addField( "Acknowledgements: ", `${acknowledgements}`, true )
				.addField(
					`Roles [${
						member.roles.cache
							.filter( ( r ) => r.id !== message.guild.id )
							.map( ( roles ) => `\`${roles.name}\`` ).length
					}]`,
					`${
						member.roles.cache
							.filter( ( r ) => r.id !== message.guild.id )
							.map( ( roles ) => `<@&${roles.id}>` )
							.join( " **|** " ) || "No Roles"
					}`,
					true,
				)
				.setTimestamp()
				.setFooter( `Caden-San's info module` );
			
			await message.channel.send( { embeds: [ infoEmbed ] } );
			
			//TODO: when a raw id is typed, do not send intel about the user that sent the message, return an error instead
			
		} catch ( error ) {
			streamKonsole.error( `${currentDate} => error occurred in ${message.guild.id} => \n\t\t\t => ${error}` );
			
			const channelDev = client.guilds.cache.get( config.baseGuildId ).channels.cache.find(
				( channel ) => channel.id === config.baseDevLogChannelId,
			);
			channelDev.send(
				`An Error occurred in ${message.guild.name} (${message.guild.id}). Stack error log : ${error}`,
			);
			return message.reply(
				`Something went wrong... You should report that in my maintenance server with your guild id and the command you tried to use.`,
			);
		}
	},
} );
