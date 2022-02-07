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
const chalk = require("chalk")
require("dotenv").config({ path: "./../.env" })
const client = new Client()

mongoose().then(() => {
    console.log(chalk.cyanBright.inverse("Caden-San is now connected to the database !"))
}).catch((e) => {
    console.log(chalk.red.inverse(`Caden-San encountered an error with the connection to the database ! Error : ${e}`))
})

client.start(process.env.TOKEN)
