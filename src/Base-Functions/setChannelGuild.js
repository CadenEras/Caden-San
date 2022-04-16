/** @Format */

const Discord = require( "discord.js" );
let userSchema = require( "./../Schema/userSchema" );
let guildSchema = require( "./../Schema/guildSchema" );
let memberSchema = require( "./../Schema/memberSchema" );
const chalk = require( "chalk" );
require( "dotenv" ).config( { path: "./../../.env" } );


//Create/Find Guilds Database
module.exports.setChannel = async function( key, guildName, systemChannel ) {
	let guildDB = await guildSchema.findOne( { _id: key, guildName: guildName, systemChannelId: systemChannel } );
	
	if( guildDB ) {
		return ( guildDB );
	} else {
		guildDB = new guildSchema( {
			_id: key,
			guildName: guildName,
			systemChannelId: systemChannel,
			createdAt: Date.now(),
		} );
		await guildDB.save().catch( err => console.log( chalk.red( "Error while fetching guild :", err ) ) );
		return guildDB;
	}
};