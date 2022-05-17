/** @format */

const Command = require( "../../Structures/command" );
const Discord = require( "discord.js" );
const fs = require( "fs" );
const config = require( "../../Config/config.json" );
const Sentry = require( "@sentry/node" );
require( "dotenv" ).config( { path: "./../../.env" } );
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let currentDate = Date.now().toString();

module.exports = new Command( {
	name: "server-info",
	description: "Get information of the current server !",
	guildOnly: true,
	cooldown: 5,
	usage: "server-info",
	permission: "SEND_MESSAGES",
	async run( message, args, client ) {
		try {
			const embed1 = new Discord.MessageEmbed()
				
				.setTitle( `Here is ${message.guild.name}'s information :` )
				.setColor( "#af4ae9" )
				.setDescription(
					`Guild's name : ${message.guild.name}\nGuild's ID : ${message.guild.id}\nCreated on : ${message.guild.createdAt}\nMember count : ${message.guild.memberCount}\nOwner <@${message.guild.ownerId}> (${message.guild.ownerId})\n`,
				)
				.setThumbnail( `${message.guild.iconURL()}` )
				.setAuthor( `${message.guild.name}`, `${message.guild.iconURL()}` )
				.setTimestamp();
			
			await message.channel.send( { embeds: [ embed1 ] } );
			
			//TODO: when a raw id is typed, do not send intel about the server that sent the message, return an error instead
		} catch ( error ) {
			Sentry.captureException(error);
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
