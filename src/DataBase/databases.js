const Discord = require("discord.js")
const userSchema = require("./../Schema/userSchema")
let guildSchema = require("./../Schema/guildSchema")
const chalk = require("chalk")
const { ModifierFlags } = require("typescript")
require("dotenv").config({ path: "./../../.env"})

//Create/Find Guilds Database
module.exports.fetchGuild = async function(key){
    let guildDB = await guildSchema.findOne({ id: key })

    if(guildDB){
        return(guildDB)
    } else {
        guildDB = new guildSchema({
            id: key,
            createdAt: Date.now()
        })
        await guildDB.save().catch(err => console.log(chalk.red("Error while fetching guild :", err)))
        return guildDB
    }
}

//Create/find Members Database
module.exports.fetchMember = async function(userId, guildId){
    let memberDB = await memberSchema.findOne({ id: userId, guildId: guildId })
    
    if(memberDB){
        return memberDB
    } else {
        memberDB = new memberSchema({
            id: userId,
            guildId: guildId,
            createdAt: Date.now()
        })
        await memberDB.save().catch(err => console.log(chalk.red("Error while fetching user :", err)))
    }
}