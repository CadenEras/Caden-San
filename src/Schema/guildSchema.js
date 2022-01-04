/**@format */ 

const mongoose = require('mongoose');
require("dotenv").config({path: "./../../.env"})

const reqString = {
    type: String,
    required: true
}

const guildSchema = new mongoose.Schema({
    _id: reqString,   //guild ID
    guildName: reqString,
    prefix: { type: String, default: process.env.DEFAULTPREFIX },
    lastEdited: String,
    createdAt: Date,
    joignedAt: Date,
    muteRoleId: { type: String, required: false },
    memberRoleId: { type: String, required: false },
    logChannelId: {type: String, required: false},
    

})

const name = 'guild-profile'

module.exports = mongoose.model('Guild', guildSchema)