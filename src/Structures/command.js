/**@format */

const Client = require( "./client" );
const Data = require( "./../DataBase/databases" );
const Discord = require( "discord.js" );

/**
 * define the type of each parameter the run function bellow will take
 * @param {Discord.Message | Discord.CommandInteraction} message
 * @param {string[]} args
 * @param {Client} client
 * @param {Data} data
 */

function RunFunction( message, args, client, data ) {
}

class Command {
	/**
	 * @typedef {"BOTH" | "SLASH" | "TEXT"} CommandType
	 * @typedef {name: string, description: string, usage: string, permission: Discord.PermissionString, type: CommandType, guildOnly: boolean, slashOptions: Discord.ApplicationCommandOptions[], run: RunFunction} CommandOptions
	 * @param {CommandOptions} options
	 */
	
	constructor( options ) {
		this.name = options.name;
		this.description = options.description;
		this.permission = options.permission;
		this.type = [ "BOTH", "SLASH", "TEXT" ].includes( options.type ) ? options.type : "TEXT";
		this.guildOnly = options.guildOnly;
		this.usage = options.usage;
		this.cooldown = options.cooldown;
		this.run = options.run;
	}
}

module.exports = Command;
