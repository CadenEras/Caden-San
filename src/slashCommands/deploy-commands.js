/** @format */

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types');
const config = require('../Config/config.json');
const fs = require( "fs" );
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let currentDate = Date.now().toString();

const commands = [];

const rest = new REST({ version: '9'}).setToken(config.token);

rest.put(Routes.applicationGuildCommands(config.selfId, config.baseGuildId), { body: commands})
    .then(() => streamKonsole.log('Slash command deployed !'))
    .catch((err) => streamKonsole.error(`${currentDate} => Error while deploying slash commands : ${err}`));