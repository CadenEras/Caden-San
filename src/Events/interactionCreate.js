/**@format */

const Discord = require( "discord.js" );
const Event = require( "../Structures/event" );
const config = require( "./../Config/config.json" );
const fs = require( "fs" );
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let currentDate = Date.now().toString();

module.exports = new Event( "interactionCreate", ( client, interaction ) => {
	if( interaction.user.bot || !interaction.isCommand() || !interaction.guild ) return;
	
	//TODO slash command to add
	
	const args = [
		interaction.commandName,
		...client.commands
			.find( ( command ) => command.name.toLowerCase() === interaction.commandName )
			.slashCommandOptions.map( ( v ) => `${interaction.options.get( v.name ).value}` ),
	];
	
	const command = client.commands.find(
		( command ) => command.name.toLowerCase() === interaction.commandName,
	);
	
	if( !command ) return interaction.reply( "Hm... That is not a valid command." );
	
	const permission = interaction.member.permissions.has( command.permission );
	
	if( !permission ) return interaction.reply( "Wait ! You does not have the permission to do that." );
	
	command.run( interaction, args, client );
} );
