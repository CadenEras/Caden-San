/**@format */

const Discord = require( "discord.js" );
const Event = require( "../Structures/event" );
const config = require( "./../Config/config.json" );
const fs = require( "fs" );
const Sentry = require("@sentry/node");
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let time = Date.now();
const currentDate = new Date(time).toISOString();

module.exports = new Event( "messageCreate", async ( client, message ) => {
	try {
		//That's my way to see if it works...
		/*if (message.guild)
		 console.log(
		 `${message.author.tag} in #${message.channel.name} from ${message.guild.name} sent a message. Message content : "${message.content}"`
		 )*/
		
		//Usual verifications, we don't want it to respond to a bot or to be used outside a server...
		if( message.author.bot ) return;
		if( !message.guild ) return;
		
		//...Getting the prefix and all the data needed
		let guildCard;
		if( !guildCard ) {
			guildCard = await client.DataBase.fetchGuild(
				message.guild.id,
				message.guild.name,
				message.guild.systemChannelId,
				message.guild.joignedAt,
			);
		}
		if( !message.guild.prefix ) {
			guildCard = await client.DataBase.fetchGuild( message.guild.id );
			message.guild.prefix = guildCard.prefix.toLowerCase();
		}
		
		//Fetching some data...
		let userData;
		if( !userData ) userData = await client.DataBase.fetchUser( message.author.id );
		
		let memberData;
		if( !memberData )
			memberData = await client.DataBase.fetchMember( message.author.id, message.guild.id );
		
		let prefix = message.guild.prefix;
		
		//We can mention the bot if we forgot the prefix
		if(
			message.content === `<@!${message.client.user.id}>` ||
			message.content === `<@${message.client.user.id}>`
		) {
			return message.reply(
				`Forgot how to use me ? My prefix is \`${prefix}\` ! Use \`${prefix}help\` to find all you need about me !`,
			);
		}
		
		//...Then starting message verification routine
		if( !message.content.startsWith( prefix ) ) return;
		
		const args = message.content.slice( prefix.length ).trim().split( / +/g );
		//const arg = args.shift().toLowerCase();
		
		const command = client.commands.find( ( cmd ) => cmd.name === args[0] );
		
		if( !command ) {
			return;
		} else {
			streamKonsole.log( `${command.name} found` );
		}
		
		//Checking Author permissions...
		const permission = message.member.permissions.has( command.permission, true );
		if( !permission ) {
			streamKonsole.log(
				`[Command Logger] ${Date.now}\nFrom : ${message.guild.id}, User ${message.author} used ${command.name} but is missing some permissions`,
			);
			return message.reply(
				"Oops ! It seems that you are trying to override your permission !",
			);
		}
		
		//Getting the data for commands...
		let data = {};
		data.user = userData;
		data.member = memberData;
		data.guild = guildCard;
		
		//... Then run the command !
		command.run( message, args, client, data );
	} catch ( error ) {
		//handle error (always sending errors to Sentry too)
		Sentry.captureException(error);
		streamKonsole.error( `${currentDate} => error occurred in ${message.guild.id} => \n\t\t\t => ${error}` );
		
		const channelDev = client.guilds.cache.get( config.baseGuildId ).channels.cache.find(
			( channel ) => channel.id === config.baseDevLogChannelId,
		);
		channelDev.send(
			`${currentDate} => An Error occurred in ${message.guild.name} (${message.guild.id}). Stack error log : ${error}`,
		);
		return message.reply(
			`Something went wrong... You should report that in my maintenance server with your guild id and the command you tried to use.`,
		);
	}
} );
