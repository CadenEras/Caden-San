/**@format */

const config = require( "./../Config/config.json" );
const Event = require( "./../Structures/event" );
const fs = require( "fs" );
const Sentry = require("@sentry/node");
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let currentDate = Date.now().toString();

module.exports = new Event( "guildMemberRemove", async ( client, member ) => {
	//to use
	//console.log(`${currentDate} [MEMBER EVENT] Member removed in ${member.guild.name} .`)
} );
