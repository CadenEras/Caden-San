/** @format */

const Event = require( "../Structures/event" );
const mongoose = require( "mongoose" );
const Guild = require( "./../Schema/guildSchema" );
const fs = require( "fs" );
const config = require( "../Config/config.json" );
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let currentDate = Date.now().toString();

const defaultPrefix = process.env.DEFAULTPREFIX;

module.exports = new Event( "guildCreate", ( client, guild, message ) => {
	streamKonsole.log(
		`${currentDate} [GUILD EVENT] ${guild.name} (${guild.id}) added Caden-San. Ready on it. Owner should start configuration.`,
	);
	
	const channel = client.channels.cache.find( ( channel ) => channel.id === guild.systemChannelId );
	
	try {
		return channel.send( "Welcome ! this is a test message !" );
	} catch ( error ) {
		//handle error
		streamKonsole.error( `${currentDate} => ${error}` );
	}
} );
