const discord = require('discord.js');
const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    lastEdited: String,
    prefix: { type: String, default: "c!" },
    muteRoleId: { type: String, required: false },
    memberDefaultRoleId: { type: String, required: false },
    logChannelId: {type: String, required: false}

})

module.exports = new mongoose.model('Guild', guildSchema, 'guilds')