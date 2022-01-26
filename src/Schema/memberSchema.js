/**@format */

const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true
}

const memberSchema = new mongoose.Schema({
    _id: reqString, //user's id
    guild: { type: String }, //user's guild
    createdAt: Date
})

module.exports = new mongoose.model('member', memberSchema)