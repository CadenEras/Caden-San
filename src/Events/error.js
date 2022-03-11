/**@format */

const Event = require("../Structures/event")
const fs = require( "fs" );
const config = require( "../Config/config.json" );
let logFileStream = fs.createWriteStream(config.logFileStreamPath)
let streamKonsole = new console.Console(logFileStream, logFileStream, false)
let currentDate = Date.now()

module.exports = new Event("error", (client, error) => {
    //client.logger.log(`Error event reported by Discord.js: \n\n\n${JSON.stringify(error)}\n\n\n`, "error")
    streamKonsole.log(`${currentDate} [ERROR EVENT] New error occurred : ${error}`)
})
