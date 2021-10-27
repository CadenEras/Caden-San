/**@format */

/*
 *
 * Caden-San V4, moderation bot for discord
 * Created on july 2021 under GNU GPL v3 License
 * by CadenEras (Melissa Gries) CadenEras#2020(795326819346808832)
 *
 */

const Client = require("./Structures/client")
const mongoose = require("./DataBase/mongoose")
const config = require("./Config/config.json")
require("dotenv").config({ path: "./../.env" })
const client = new Client()

mongoose.init()
client.start(process.env.TOKEN)
