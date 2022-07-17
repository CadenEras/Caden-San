/** @format */

const Command = require( "../../Structures/command" );
require( "dotenv" ).config( { path: "./../../.env" } );
const Discord = require( "discord.js" );
const pagination = require("discord.js-pagination");
const fs = require( "fs" );
const config = require( "../../Config/config.json" );
const Sentry = require( "@sentry/node" );
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let time = Date.now();
const currentDate = new Date(time).toISOString();

module.exports = new Command( {
	name: "help",
	description:
		"Display the list of commands if you just type !help or if you type !help command display info about the command!",
	guildOnly: true,
	cooldown: 5,
	usage: "help or help [command]",
	permission: "SEND_MESSAGES",
	async run( message, args, client ) {
		const command = client.commands.find( ( cmd ) => cmd.name === args[1] );
		
		//TODO fix that !
		
		try {
			let pause = ms => new Promise( ( timeOut, j ) => setTimeout( timeOut, ms ) );
			let helpEmbed = {};
			fs.readdir( "../../Commands/", ( err2, manual ) => {
				for ( let i = 0; i < manual.length; i ++ ) {
					helpEmbed[i] = new Discord.EmbedBuilder();
					helpEmbed[i].setTitle( manual[i] );
					helpEmbed[i].setColor( "#af4ae9" );
					const j = i;
					fs.readdir( `../../Commands/${manual[i]}/`, ( err1, files1 ) => {
						files1.forEach( ( f2, i2 ) => {
							const cmd = f2.replace( ".js", "" );
							helpEmbed[j].addField( cmd, "testing" );
						} );
					} );
				}
			} );
			await pause( 50 );
			let numPage = [];
			let f = 0;
			for ( let step = 0; f === 0; step ++ ) {
				if( helpEmbed[numPage.length] ) {
					numPage[numPage.length] = helpEmbed[numPage.length];
					console.log( "+1" );
				} else {
					f = 1;
				}
			}
			await pause( 50 );
			const emojis = [ "◀", "▶" ];
			
			await pagination( message, numPage, emojis );
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
		
		/*if( !command ) {
			const embed1 = new Discord.EmbedBuilder()
				
				.setTitle( "Caden-San's Library" )
				.setColor( "#af4ae9" )
				.setDescription(
					"Get all the help you need with me !\n Try `c!help [command]` for more info !",
				)
				.setThumbnail( "https://i.imgur.com/ek6dDxa.png" )
				.setAuthor( {
					name: "Caden-San's help module",
					iconURL: "https://i.imgur.com/ek6dDxa.png"
				} )
				.addFields(
					{
						name: "Utilities",
						value: "`help` `server-info` `user-info` `about` `ping`",
					},
					{
						name: "Moderation :",
						value: "`ban` `unban` `kick` `mute` `unmute` `clear`",
					},
					{
						name: "Settings :",
						value: "`prefix` `settings` `setMuteRole`",
					},
				)
				.setTimestamp()
				.setFooter( {
					text: "Made By CadenEras#2020, with love <3"
				} );
			
			await message.channel.send( { embeds: [ embed1 ] } );
		} else {
			{
				try {
					const embed2 = new Discord.EmbedBuilder()
						
						.setTitle( "Caden-San's Library" )
						.setColor( "#af4ae9" )
						.setDescription( "Get all the help you need with me !" )
						.setThumbnail( "https://i.imgur.com/ek6dDxa.png" )
						.setAuthor( {
							name: "Caden-San's help module",
							iconURL: "https://i.imgur.com/ek6dDxa.png"
						} )
						.addField(
							`Command: ${message.guild.prefix}${command.name}`,
							`Description: ${command.description}\n` +
							`Usage: ${command.usage}\n` +
							`Permission needed: ${command.permission}\n`,
						)
						.setTimestamp()
						.setFooter( {
							text: "Made By CadenEras#2020, with love <3"
						} );
					
					message.channel.send( { embeds: [ embed2 ] } );
				}
			}
		}*/
	},
} );
