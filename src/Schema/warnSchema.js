/**@format */

const mongoose = require("mongoose");

const reqString = {
	type: String,
	required: true,
};

const warnSchema = new mongoose.Schema({
	_id: { type: String }, //user's id
	member: { type: String },
	moderator: { type: String },
	guild: { type: String }, //user's guild where the warn was created
	reason: { type: String },
	createdAt: { type: Number, default: Date.now() },
});

module.exports = mongoose.model("warn", warnSchema);
