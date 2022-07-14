/** @format */

const Command = require( "../../structures/command" );
const fs = require( "fs" );
const config = require( "../../Config/config.json" );
const Sentry = require( "@sentry/node" );
require( "dotenv" ).config( { path: "./../../.env" } );
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let time = Date.now();
const currentDate = new Date(time).toISOString();

module.exports = new Command( {
	name: "unban",
	description: "To unban a member with their ID.",
	permission: "BAN_MEMBERS",
	usage: "unban [userID]",
	guildOnly: true,
	async run( message, args, client ) {
		try {
			if( !args[1] )
				return message.reply(
					"Forgot how to use this command ? Try `c!help mute` to see how it works.",
				);
			const userID = args[1];
			
			message.guild.bans.fetch().then( ( bans ) => {
				//Checking if there is a ban list in the server
				if( bans.size === 0 )
					return message.reply(
						"It appear that this guild does not have any banned user...",
					);
				
				//Checking if the user was really banned of the server...
				const bannedUser = bans.find( ( banned ) => banned.user.id === userID );
				if( !bannedUser )
					return message.reply( "This user does not seem to have been banned..." );
				
				//...then unban the user
				message.guild.members.unban( bannedUser.user );
				message.channel.send(
					`<@${userID}> (${userID})has been successfully unban by ${message.author.tag}!`,
				);
			} );
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
