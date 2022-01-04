/**@format */

const Discord = require("discord.js")
require("dotenv").config({ path: "./../../.env" })
const Command = require("./Command.js")
const Event = require("./Event.js")
const config = require("../Config/config.json")
const intents = new Discord.Intents(32767)
const fs = require("fs")
const DataBase = require("./../DataBase/databases")



class Client extends Discord.Client {
   constructor() {
      super({ intents })

      /**
       * @type {Discord.Collection<string, Command>}
       */
      this.commands = new Discord.Collection()
      this.DataBase =  DataBase

   }

   start(token) {
      //Command handler
      fs.readdirSync("./Commands").forEach((dirs) => {
         const commands = fs.readdirSync(`./Commands/${dirs}`).filter((files) => files.endsWith(".js"))

         /**
          * @type {Command[]}
          */

         for (const file of commands) {
            const command = require(`../Commands/${dirs}/${file}`)

            console.log(`Loading Caden\'s fonctions... Charging : "${command.name}"...`)
            this.commands.set(command.name, command)
         }

         //Slash command handler
         const slashCommands = commands
            .filter((command) => ["BOTH", "SLASH"].includes(command.type))
            .map((command) => ({
               name: command.name.toLowerCase(),
               description: command.description,
               permissions: [],
               options: command.slashCommandOptions,
               defaultPermission: true,
            }))

         this.removeAllListeners()

         this.on("ready", async () => {
            const cmds = await this.application.commands.set(slashCommands)

            cmds.forEach((cmd) => console.log(`Slash Command ${cmd.name} registered`))
         })
      })

      //Event handler
      fs.readdirSync(`./events`)
         .filter((files) => files.endsWith(".js"))
         .forEach((file) => {
            /**
             * @type {Event}
             */
            const event = require(`../Events/${file}`)
            console.log(`Loading Caden\'s event... Charging : "${event.event}"...`)
            this.on(event.event, event.runFunction.bind(null, this))
         })

      //Will generate an API Error after reaching the 1000th login/day (v13)
      this.login(token)
   }
}

module.exports = Client
