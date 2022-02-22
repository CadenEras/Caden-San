/**@format */

const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true
}

const memberSchema = new mongoose.Schema({
    _id: { type: String }, //user's id
    guild: { type: Array }, //user's guild
    createdAt: { type: Number, default: Date.now() }
})

module.exports = new mongoose.model('member', memberSchema)