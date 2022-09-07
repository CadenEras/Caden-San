/**@format */

const mongoose = require("mongoose");

const reqString = {
	type: String,
	required: true,
};

const memberSchema = new mongoose.Schema({
	_id: { type: String }, //user's id
	member: { type: String },
	moderator: { type: String },
	guild: { type: String }, //user's guild  | Array of value for storing mutiple guild id
	reason: { type: String },
	createdAt: { type: Number, default: Date.now() },
});

module.exports = mongoose.model("member", memberSchema);
