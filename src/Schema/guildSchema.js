/**@format */ 

const config = require("./../Config/config.json");
const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const guildSchema = new mongoose.Schema({
    _id: reqString,   //guild ID
    //guildName: reqString,
    prefix: { type: String, default: config.prefix },
    joignedAt: Date,
    muteRoleId: { type: String, required: false },
    memberRoleId: { type: String, required: false },
    logChannelId: {type: String, required: false},
    
    addons: { type: Object, default: {
        welcome: {
            enabled: false,
            channelId: null,
            message: null
        }
    }}
})

const name = 'guild-profile'

module.exports = mongoose.model('Guild', guildSchema)