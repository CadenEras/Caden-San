const Discord = require("discord.js")
let userSchema = require("./../Schema/userSchema")
let guildSchema = require("./../Schema/guildSchema")
let memberSchema = require("./../Schema/memberSchema")
const chalk = require("chalk")
require("dotenv").config({ path: "./../../.env"})

//Create/Find Guilds Database
module.exports.fetchGuild = async function(key, guildName, systemChannel){
    let guildDB = await guildSchema.findOne({ _id: key, guildName: guildName, systemChannelId: systemChannel })

    if(guildDB){
        return(guildDB)
    } else {
        guildDB = new guildSchema({
            _id: key,
            guildName: guildName,
            systemChannelId: systemChannel,
            createdAt: Date.now()
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
        return userDB;
    }
};

//Create/find Members Database
module.exports.fetchMember = async function(userID, guildId){
    let memberDB = await memberSchema.findOne({ _id: userID, guild: guildId })
    
    if(memberDB){
        return memberDB
    } else {
        memberDB = new memberSchema({
            _id: userID,
            guild: guildId,
            createdAt: Date.now()
        })
        await memberDB.save().catch(err => console.log(chalk.red("Error while fetching member :", err)))
    }
}