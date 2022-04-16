/** @format */

const Event = require( "../Structures/event" );
const fs = require( "fs" );
const config = require( "../Config/config.json" );
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let currentDate = Date.now().toString();

module.exports = new Event( "guildMemberAdd", async ( client, member ) => {
	//Only send welcome message if welcone message is enabled
	let guildOfMember = member.guild;
	let guildCard = await client.DataBase.fetchGuild( guildOfMember.id );
	if( !guildCard.addons.welcome.enabled || guildCard.addons.welcome.channelId === null || guildCard.addons.welcome.message === null ) {
		return;
	} else {
		let welcomeChannel = guildCard.addons.welcome.channelId;
		let fetchedChannel = client.guilds.cache.get( member.guild.id ).channels.cache.get( welcomeChannel );
		
		let welcomeMessage = guildCard.addons.welcome.message;
		
		try {
			await fetchedChannel.send( welcomeMessage );
		} catch ( error ) {
			streamKonsole.log( `${currentDate} => ${error}` );
		}
	}
} );