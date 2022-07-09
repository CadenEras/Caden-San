/** @format */

//In development
const Rest = require('@discordjs/rest');
const Api = require('discord-api-types/v9');
const config = require('../Config/config.json');
const fs = require( "fs" );
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let currentDate = Date.now().toString();

commands = [];

fs.readdirSync('./Commands').forEach((dirs) => {
  const commands = fs
    .readdirSync(`./Commands/${dirs}`)
    .filter((files) => files.endsWith(".js"));
  
  /**
   * @type {Command[]}
   */
  
  for ( const file of commands ) {
    const command = require(`../Commands/${dirs}/${file}`);
    commands.push(command.data.toJSON());
  }
})

const rest = new Rest.REST({ version: '9'}).setToken(config.token);

rest.put(Api.Routes.applicationGuildCommands(config.selfId, config.baseGuildId), { body: commands})
    .then(() => streamKonsole.log('Slash command deployed !'))
    .catch((err) => streamKonsole.error(`${currentDate} => Error while deploying slash commands : ${err}`));