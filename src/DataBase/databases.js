const Discord = require("discord.js")
let userSchema = require("./../Schema/userSchema")
let guildSchema = require("./../Schema/guildSchema")
let memberSchema = require("./../Schema/memberSchema")
let logSchema = require("./../Schema/log")
const chalk = require("chalk")
const fs = require( "fs" );
const config = require( "../Config/config.json" );
let logFileStream = fs.createWriteStream(config.logFileStreamPath, {flags: 'a'})
let streamKonsole = new console.Console(logFileStream, logFileStream, false)
let currentDate = Date.now()

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
        await guildDB.save().catch(err => streamKonsole.log(`${currentDate} Error while fetching guild : ${err}`))
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
        await userDB.save().catch(err =>streamKonsole.log(`${currentDate} Error while fetching user : ${err}`))
        return userDB
    }
};

//Create/find Members Database
module.exports.fetchMember = async function(key, guildId){
    
    let memberDB = await memberSchema.findOne({ _id: key })
    
    if(memberDB){
        let memberDBWithGuild = await memberSchema.findOne({ _id: key, guild: guildId})
        if(memberDBWithGuild) {
            console.log(memberDBWithGuild)
            return memberDBWithGuild
        } else {
            memberSchema.updateOne(
                { _id: key },
                {
                    $push: {
                        guild: guildId
                    },
                },
            ).catch(err => streamKonsole.log(`${currentDate} Error while updating guild for member : ${err}`))
            console.log(memberDBWithGuild)
            return memberDBWithGuild
        }
    } else {
        memberDB = new memberSchema({
            _id: key,
            guild: guildId,
            
            createdAt: Date.now()
        })
        await memberDB.save().catch(err => streamKonsole.log(`${currentDate} Error while fetching member : ${err}`))
            return memberDB
    }
}