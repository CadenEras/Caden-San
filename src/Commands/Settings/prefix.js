/** @format */

const Command = require( "../../Structures/command" );
const mongoose = require( "mongoose" );
const UserP = require( "../../Schema/userSchema" );
const Discord = require( "discord.js" );
const fs = require( "fs" );
const config = require( "../../Config/config.json" );
const Sentry = require( "@sentry/node" );
require( "dotenv" ).config( { path: "./../../.env" } );
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let currentDate = Date.now().toString();

const defaultPrefix = "c!";

module.exports = new Command( {
	name: "prefix",
	description: "Set a new prefix",
	guildOnly: true,
	usage: "prefix",
	permission: "ADMINISTRATOR",
	async run( message, args, client ) {
		try {
			if( !args[1] )
				return message.reply(
					"Forgot how to use this command ? Try `c!help prefix` to see how it works.",
				);
			let guildData;
			if( !guildData ) guildData = await client.DataBase.fetchGuild( message.guild.id );
			
			let prefix = args.slice( 1 ).join( " " );
			guildData.prefix = prefix;
			await guildData.save();
			
			message.guild.prefix = prefix.toLowerCase();
			
			return message.channel.send( `The new prefix is : \`${prefix}\`` );
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
