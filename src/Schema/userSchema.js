const discord = require('discord.js');
const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const userSchema = new mongoose.Schema({
    _id: reqString,
    createdAt: Date
})

module.exports = new mongoose.model('UserP', userSchema)