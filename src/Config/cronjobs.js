/** @format */

const Job = require("cron").CronJob
require("dotenv").config({ path: "./../../.env" })

const client = require("./../Structures/client")
const Discord = require("discord.js")
const fs = require( "fs" );
const config = require( "./config.json" );
let logFileStream = fs.createWriteStream(config.logFileStreamPath)
let streamKonsole = new console.Console(logFileStream, logFileStream, false)
let currentDate = Date.now()

let updtMsgAbout = (module.exports = new Job("30 * * * * *", function (jClient) {
    jClient = client
    const cadenChannel = jClient.channels.cache.find((channel) => channel.id === process.env.BASEDEVLOGCHANNELID)

    let totalSeconds = jClient.uptime / 1000
    let days = Math.floor(totalSeconds / 86400)
    let hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    let minutes = Math.floor(totalSeconds / 60)
    let seconds = totalSeconds % 60

    let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`

    const embed1 = new Discord.MessageEmbed()
        .setTitle("Caden-San")
        .setColor("#af4ae9")
        .setDescription("Hi ! I'm Caden-San, a moderation bot created by CadenEras ! Try `c!help` to start with me !")
        .setAuthor("Caden-San", "https://i.imgur.com/ek6dDxa.png")
        .addField(`Art by`, `Opheliart#3547 (633310607730278402)`)
        .addField(`Language`, `JavaScript`, true)
        .addField(`Prefix`, `c!`, true)
        .addField(`Owner`, `CadenEras#2020 (795326819346808832)`, true)
        .addField(`Creation date`, `July 2021`, true)
        .addField(`Maintenance Server`, `https://discord.gg/P7JeGwBRYU`, true)
        .addField(`Repository (GitHub)`, `https://github.com/CadenEras/Caden_San`, true)
        .addField(
            `Memory usage`,
            `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(
                process.memoryUsage().heapUsed /
                1024 /
                1024
            ).toFixed(2)} MB Heap.`,
            true
        )
        .addField(`Uptime`, `${uptime}`, true)
        .setImage("https://i.imgur.com/ek6dDxa.png")
        .setTimestamp()
        .setFooter("Made By CadenEras#2020, with love <3")

    try {
        cadenChannel.messages.fetch("940563298846388284").then((msg) => {
            setTimeout(function () {
                msg.edit({ embeds: [embed1] })
            }, 30000)
        })
    } catch (e) {
        streamKonsole.log(error)
        const channelDev = jClient.channels.cache.find((channel) => channel.id === process.env.BASEDEVLOGCHANNELID)
        channelDev.channel.send(`Something went wrong with the Cron Job update. Stack error log : ${error}`)
    }
}))
