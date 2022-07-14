/** @format */

const Event = require( "../Structures/event" );
//const mongoose = require( "mongoose" );
//const Guild = require( "./../Schema/guildSchema" );
const fs = require( "fs" );
const config = require( "../Config/config.json" );
const Sentry = require("@sentry/node");
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let time = Date.now();
const currentDate = new Date(time).toISOString();

//not useful I guess
//const defaultPrefix = config.prefix;

module.exports = new Event( "guildCreate", ( client, guild, message ) => {
	streamKonsole.log(
		`${currentDate} [GUILD EVENT] ${guild.name} (${guild.id}) added Caden-San. Ready on it. Owner should start configuration.`,
	);
	
	const channel = client.channels.cache.find( ( channel ) => channel.id === guild.systemChannelId );
	
	try {
		return channel.send( "Welcome ! this is a test message !" );
	} catch ( error ) {
		//handle error
		Sentry.captureException(error);
		streamKonsole.error( `${currentDate} => ${error}` );
	}
} );
