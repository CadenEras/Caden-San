/**@format */

const Client = require('./client')

const Discord = require('discord.js')

/**
 * define the type of each parameter the run fonction bellow will take
 * @param {Discord.Message | Discord.CommandInteraction} message
 * @param {string[]} args
 * @param {Client} client
 */

function RunFunction(message, args, client) {}

class Command {
  /**
   * @typedef {"BOTH" | "SLASH" | "TEXT"} CommandType
   * @typedef {{name: string, description: string, usage: string, permission: Discord.PermissionString, type: CommandType, slashOptions: Discord.ApplicationCommandOptions[] run: RunFunction}} CommandOptions
   * @param {CommandOptions} options
   */

  constructor(options) {
    this.name = options.name
    this.description = options.description
    this.permission = options.permission
    this.type = ['BOTH', 'SLASH', 'TEXT'].includes(options.type) ? options.type : 'TEXT'
    this.usage = options.usage
    this.cooldown = options.cooldown
    this.run = options.run
  }
}

module.exports = Command