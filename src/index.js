/**@format */

/*
 *
 * Caden-San V4, moderation bot for discord
 * Created on july 2021 under GNU GPL v3 License
 * by CadenEras (Melissa Gries) CadenEras#2020(795326819346808832)
 *
 */

//This is the start, nothing above, everything below !

const Client = require("./Structures/client")
const mongoose = require("./DataBase/mongoose")
require("dotenv").config({ path: "./../.env" })
const config = require("./Config/config.json")
//Using Sentry here => sentry.io
const Sentry = require("@sentry/node")
const Tracing = require("@sentry/tracing")
//to color console output
const chalk = require("chalk")
const fs = require("fs")
//Redirecting the output in a file. The two lines of code below are wherever needed in the whole code
let logFileStream = fs.createWriteStream(config.logFileStreamPath)
let streamKonsole = new console.Console(logFileStream, logFileStream, false)

const client = new Client()

Sentry.init({
    dsn: config.dsnSentry,
    integrations: [new Tracing.Integrations.Mongo({
        useMongoose: true
    })],
    tracesSampleRate: 1
})

const transaction = Sentry.startTransaction({
    op: "transaction",
    name: "Caden Transaction"
})

mongoose()
    .then(() => {
        streamKonsole.log("Caden-San is connecting to the database !")
    })
    .catch((error) => {
        streamKonsole.log(
            `Caden-San encountered an error trying to connect to the database ! Error : ${error}`
        )
    })

process.on('uncaughtException', function ( err ) {
    console.log((err && err.stack) ? err.stack : err)
    streamKonsole.log((err && err.stack) ? err.stack : err)
    Sentry.captureException(err)
})

client.start(process.env.TOKEN)
