/** @format */

const Command = require("../../Structures/command")

module.exports = new Command({
   name: "ping",
   description: "Get the bot response time !",
   type: "BOTH",
   guildOnly: true,
   usage: "c!ping",
   permission: "SEND_MESSAGES",
   async run(message, args, client) {
      function randRespond() {
         let index = Math.floor(Math.random()*(responses.length))
         return responses[index]
      }
      let responses = [
         `pong ! I'm alive ! ${Math.round(client.ws.ping)} ms, ${Date.now() - message.createdTimestamp} ms.`,
         `pong ! I'm here ! How are you ?  ${Math.round(client.ws.ping)} ms, ${Date.now() - message.createdTimestamp} ms.`,
         `Yes I am awake ! Pong => ${Math.round(client.ws.ping)} ms, ${Date.now() - message.createdTimestamp} ms.`,
         `Are we playing ping-pong ?  ${Math.round(client.ws.ping)} ms, ${Date.now() - message.createdTimestamp} ms.`,
         `pong ? ${Math.round(client.ws.ping)} ms, ${Date.now() - message.createdTimestamp} ms.`
      ]
      await message.channel.send(
         randRespond()
      )
   },
})
