const discord = require('discord.js');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    userName: String,
    lastEdited: String,
    createdAt: Date
})

module.exports = new mongoose.model('UserP', userSchema)