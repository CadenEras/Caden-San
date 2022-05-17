/** @format */

const config = require( "../Config/config.json" );
require( "dotenv" ).config( { path: "./../../.env" } );

const fs = require( "fs" );
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );

let streamKonsole = new console.Console( logFileStream, logFileStream, false );
let today = new Date();
let currentDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
let currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let cdt = currentDate + ' ' + currentTime;

module.exports.streamKonsole = function () {
  return x + y;
};