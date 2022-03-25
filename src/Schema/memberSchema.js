/**@format */

const mongoose = require("mongoose")

const reqString = {
    type: String,
    required: true,
}

const memberSchema = new mongoose.Schema({
    _id: { type: String }, //user's id
    guild: { type: [String] }, //user's guild  | Array of value for storing mutiple guild id
    createdAt: { type: Number, default: Date.now() },
    warnSize: [{
        type: String,
        enum: [10],
        index: true
    }]
})

module.exports = mongoose.model("member", memberSchema)
