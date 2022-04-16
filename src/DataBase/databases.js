/**@Format*/

const Discord = require( "discord.js" );
let userSchema = require( "./../Schema/userSchema" );
let guildSchema = require( "./../Schema/guildSchema" );
let memberSchema = require( "./../Schema/memberSchema" );
let logSchema = require( "./../Schema/log" );
const chalk = require( "chalk" );
const fs = require( "fs" );
const config = require( "../Config/config.json" );
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let currentDate = Date.now().toString();

//Create/Find Guilds Data
module.exports.fetchGuild = async function( key, guildName, systemChannel, joignedTime ) {
	let guildDB = await guildSchema.findOne( { _id: key } );
	
	if( guildDB ) {
		return ( guildDB );
	} else {
		guildDB = new guildSchema( {
			_id: key,
			guildName: guildName,
			systemChannelId: systemChannel,
			joignedAt: joignedTime,
		} );
		await guildDB.save().catch( err => streamKonsole.log( `${currentDate} Error while fetching guild : ${err}` ) );
		return guildDB;
	}
};

//Create/Find Users Data
module.exports.fetchUser = async function( key ) {
	
	let userDB = await userSchema.findOne( { _id: key } );
	if( userDB ) {
		return userDB;
	} else {
		userDB = new userSchema( {
			_id: key,
			registeredAt: Date.now(),
		} );
		await userDB.save().catch( err => streamKonsole.log( `${currentDate} Error while fetching user : ${err}` ) );
		return userDB;
	}
};

//Create/find Members Data
module.exports.fetchMember = async function( key, guildId ) {
	//Checking if member exist
	let memberDB = await memberSchema.findOne( { _id: key } );
	
	if( memberDB ) {
		//If yes, with the correct guild id stored ?
		let memberDBWithGuild = await memberSchema.findOne( { _id: key, guild: guildId } );
		if( memberDBWithGuild ) {
			//If yes, return data
			return memberDBWithGuild;
		} else {
			//If no, append new guild id in the data, then return data
			memberSchema.updateOne(
				{ _id: key },
				{
					$push: {
						guild: guildId,
					},
				},
			).catch( err => streamKonsole.log( `${currentDate} Error while updating guild for member : ${err}` ) );
			return memberDBWithGuild;
		}
	} else {
		//Else, create new member
		memberDB = new memberSchema( {
			_id: key,
			guild: guildId,
			
			createdAt: Date.now(),
		} );
		await memberDB.save().catch( err => streamKonsole.log( `${currentDate} Error while fetching member : ${err}` ) );
		return memberDB;
	}
};