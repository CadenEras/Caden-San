/** @format */

//Not used and working actually
const mongoose = require( "mongoose" );

module.exports = mongoose.model(
	"Log",
	new mongoose.Schema( {
		//Storing information about each command that is run
		commandName: { type: String, default: "unknown" },
		date: { type: Number, default: Date.now() },
		author: {
			type: Object,
			default: {
				username: "Unknown",
				discriminator: "0000",
				id: null,
			},
		},
		guild: {
			type: Object,
			default: {
				name: "Unknown",
				channel: null,
				id: null,
			},
		},
	} ),
);
