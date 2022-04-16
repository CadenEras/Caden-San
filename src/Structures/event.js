/**@format */

const Discord = require( "discord.js" );

const Client = require( "./client" );

/**
 * @template {keyof Discord.ClientEvents} K
 * @param {Client} client
 * @param {Discord.ClientEvents[K]} eventArgs
 */
function RunFunction( client, ...eventArgs ) {
}

/**
 * @template {keyof Discord.ClientEvents} K
 */

class Event {
	/**
	 * @param {K} event
	 * @param {RunFunction<K>} runFunction
	 */
	constructor( event, runFunction ) {
		this.event = event;
		this.runFunction = runFunction;
	}
}

module.exports = Event;
