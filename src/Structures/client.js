/**@format */

const Discord = require( "discord.js" );
const Command = require( "./Command.js" );
const Event = require( "./Event.js" );
const intents = new Discord.Intents( 32767 );
const fs = require( "fs" );
const DataBase = require( "./../DataBase/databases" );
const Util = require( "./../Base-Functions/setChannelGuild" );
const config = require( "../Config/config.json" );
const Sentry = require("@sentry/node");
const Process = require( "process" );
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let currentDate = Date.now().toString();

let instance;

//Creating our client from Discord Client
class Client extends Discord.Client {
	constructor() {
		super( {
			intents,
			partials: [ "MESSAGE", "REACTION", "CHANNEL", "GUILD_MEMBER" ],
		} );
		
		//Prevent from creating another client if already existing
		if( instance ) {
			throw new Error( "Client instance have been already created once !" );
		}
		instance = this;
		
		/**
		 * @type {Discord.Collection<string, Command>}
		 */
		
		this.commands = new Discord.Collection();
		this.DataBase = DataBase;
		this.util = Util;
	}
	
	async start( token ) {
		//Reading command files
		fs.readdirSync( "./Commands" ).forEach( ( dirs ) => {
			const commands = fs
				.readdirSync( `./Commands/${dirs}` )
				.filter( ( files ) => files.endsWith( ".js" ) );
			
			/**
			 * @type {Command[]}
			 */
			
			for ( const file of commands ) {
				const command = require( `../Commands/${dirs}/${file}` );
				
				streamKonsole.log( `Loading Caden\'s functions... Charging : "${command.name}"...` );
				this.commands.set( command.name, command );
			}
			
			//Slash command handler
			//Actually not working
			//TODO: See how to make it work with the actual structure
			//==========================================================
			/*const slashCommands = commands
				.filter( ( command ) => [ "BOTH", "SLASH" ].includes( command.type ) )
				.map( ( command ) => ( {
					name: command.name.toLowerCase(),
					description: command.description,
					permissions: [],
					options: command.slashCommandOptions,
					defaultPermission: true,
				} ) );
				
			this.removeAllListeners();
			
			this.on( "ready", async () => {
				const cmds = await this.application.commands.set( slashCommands );
				
				await cmds.forEach( ( cmd ) => streamKonsole.log( `Slash Command ${cmd.name} registered` ) );
			} );*/
			
			//==========================================================
		} );
		
		//Reading event files
		fs.readdirSync( `./events` )
			.filter( ( files ) => files.endsWith( ".js" ) )
			.forEach( ( file ) => {
				/**
				 * @type {Event}
				 */
				const event = require( `../Events/${file}` );
				streamKonsole.log( `Loading Caden\'s event... Charging : "${event.event}"...` );
				this.on( event.event, event.runFunction.bind( null, this ) );
			} );
		
		//Will generate an API Error after reaching the 1000th login/day (v13)
		await this.login( token );
		
		//Prevent from crashing on unhandled Rejection...
		process.on( "unhandledRejection", ( error ) => {
			Sentry.captureException(error);
			streamKonsole.log( `${currentDate} => Unhandled rejection occurred:\n`, error );
		} );
		//...and uncaught exception
		Process.on("uncaughtException", (error) => {
			Sentry.captureException(error);
			streamKonsole.log( `${currentDate} => Uncaught exception occurred:\n`, error )
		})
	}
}

module.exports = Client;
