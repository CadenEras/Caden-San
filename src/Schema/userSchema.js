/**@format */

const mongoose = require("mongoose");

const reqString = {
	type: String,
	required: true,
};

const userSchema = new mongoose.Schema({
	_id: reqString, //user's id
	createdAt: Date,
});

module.exports = mongoose.model("UserP", userSchema);
