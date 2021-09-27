/**@format */

const Event = require("../Structures/event")

module.exports = new Event("error", (client, error) => {
   client.logger.log(`Error event reported by Discord.js: \n\n\n${JSON.stringify(error)}\n\n\n`, "error")
})
