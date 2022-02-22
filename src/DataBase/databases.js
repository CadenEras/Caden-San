const Discord = require("discord.js")
let userSchema = require("./../Schema/userSchema")
let guildSchema = require("./../Schema/guildSchema")
let memberSchema = require("./../Schema/memberSchema")
let logSchema = require("./../Schema/log")
const chalk = require("chalk")
require("dotenv").config({ path: "./../../.env"})

//Create/Find Guilds Database
module.exports.fetchGuild = async function(key, guildName, systemChannel, joignedTime){
    let guildDB = await guildSchema.findOne({ _id: key })

    if(guildDB){
        return(guildDB)
    } else {
        guildDB = new guildSchema({
            _id: key,
            guildName: guildName,
            systemChannelId: systemChannel,
            joignedAt: joignedTime
        })
        await guildDB.save().catch(err => console.log(chalk.red("Error while fetching guild :", err)))
        return guildDB
    }
}

module.exports.fetchUser = async function(key){

    let userDB = await userSchema.findOne({ _id: key });
    if(userDB){
        return userDB;
    }else{
        userDB = new userSchema({
            _id: key,
            registeredAt: Date.now()
        })
        await userDB.save().catch(err => console.log(chalk.red("Error while fetching member :", err)));
        return userDB
    }
};

//Create/find Members Database
module.exports.fetchMember = async function(key, guildId){
    let memberDB = await memberSchema.findOne({ _id: key, guild: guildId })
    
    if(memberDB){
        return memberDB
    } else {
        memberDB = new memberSchema({
            _id: key,
            guild: guildId,
            createdAt: Date.now()
        })
        await memberDB.save().catch(err => console.log(chalk.red("Error while fetching member :", err)))
            return memberDB
    }
}

// Create/find Log in Database
module.exports.createLog = async function(message, data){

    let logDB = new logSchema({
        commandName: data.cmd.name,
        author: { username: message.author.username, discriminator: message.author.discriminator, id: message.author.id },
        guild: { name: message.guild ? message.guild.name : "dm", id: message.guild ? message.guild.id : "dm", channel: message.channel ? message.channel.id : "unknown" },
        date: Date.now()
    })
    await logDB.save().catch(err => console.log(err))

}