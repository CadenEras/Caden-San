/** @format */

const Command = require( "../../Structures/command" );
const mongoose = require( "mongoose" );
const Discord = require( "discord.js" );
const fs = require( "fs" );
const config = require( "../../Config/config.json" );
const { channel } = require( "diagnostics_channel" );
require( "dotenv" ).config( { path: "./../../.env" } );
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let currentDate = Date.now().toString();

module.exports = new Command( {
	name: "setLogChannel",
	description: "Set your custom mute role",
	type: "TEXT",
	guildOnly: true,
	usage: "setLogChannel (channelID)",
	permission: "ADMINISTRATOR",
	async run( message, args, client ) {
		try {
			if( !args[1] )
				return message.reply(
					"Forgot how to use this command ? Try `c!help setLogChannel` to see how it works.",
				);
			let guildData;
			if( !guildData ) guildData = await client.DataBase.fetchGuild( message.guild.id );
			
			let logChannel = args.slice( 1 ).join( " " );
			
			let fetched = message.guild.channels.cache.find( ( ch ) => ch.id === args[1] );
			
			if( !fetched || fetched.type !== "GUILD_TEXT" ) {
				return message.channel.send( "This Id is not a valid channel. Please retry." );
			}
			
			guildData.logChannelId = logChannel;
			await guildData.save();
			
			message.guild.logChannel = logChannel.toLowerCase();
			
			return message.channel.send( `The new log channel is : <#${logChannel}> (${logChannel})` );
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