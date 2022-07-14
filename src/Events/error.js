/**@format */

const Event = require( "../Structures/event" );
const fs = require( "fs" );
const config = require( "../Config/config.json" );
const Sentry = require("@sentry/node");
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let time = Date.now();
const currentDate = new Date(time).toISOString();

module.exports = new Event( "error", ( client, error ) => {
	//client.logger.log(`Error event reported by Discord.js: \n\n\n${JSON.stringify(error)}\n\n\n`, "error")
	streamKonsole.log( `${currentDate} [ERROR EVENT] New error occurred : ${error}` );
} );
