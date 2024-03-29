/**@format */

const Client = require("./client");
const Data = require("./../DataBase/databases");
const Discord = require("discord.js");

/**
 * define the type of each parameter the run function bellow will take
 * @param {Discord.Message | Discord.CommandInteraction} message
 * @param {string[]} args
 * @param {Client} client
 * @param {Data} data
 */

function RunFunction(message, args, client, data) {}

class Command {
	/**
	 * @typedef {name: string, description: string, usage: string, permission: Discord.PermissionString, available: boolean, run: RunFunction} CommandOptions
	 * @param {CommandOptions} options
	 */

	constructor(options) {
		this.name = options.name;
		this.description = options.description;
		this.permission = options.permission;
		this.usage = options.usage;
		this.available = options.available;
		this.run = options.run;
	}
}

module.exports = Command;
