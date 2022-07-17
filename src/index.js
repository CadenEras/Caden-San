/**@format */

/*
 *
 * Caden-San, moderation bot for discord
 * Created on july 2021 under GNU GPL v3 License
 * by Melissa Gries (CadenEras) CadenEras#2020(795326819346808832)
 *
 */

//This is the start, nothing above, everything below !

const Client = require( "./Structures/client" );
const mongoose = require("mongoose");
const config = require( "./Config/config.json" );
const fs = require( "fs" );

//Using Sentry here => sentry.io
const Sentry = require( "@sentry/node" );
const Tracing = require( "@sentry/tracing" );

//Redirecting the output in a file. The two lines of code below are wherever needed in the whole code
let logFileStream = fs.createWriteStream( config.logFileStreamPath, { flags: "a" } );
let streamKonsole = new console.Console( logFileStream, logFileStream, false );
//Setting the time for log...
let time = Date.now();
//...in a readable format
const currentDate = new Date(time).toISOString();

//Initializing Sentry connection
Sentry.init( {
	dsn: config.dsnSentry,
	integrations: [
		new Tracing.Integrations.Mongo( {
			useMongoose: true,
		} ),
	],
	tracesSampleRate: 1.0,
} );

//Setting Sentry transaction
const transaction = Sentry.startTransaction( {
	op: "transaction",
	name: "Caden Transaction",
} );

//Configuring Sentry scope
Sentry.configureScope( ( scope ) => {
	scope.setSpan( transaction );
} );

//And then try everything here
try {
	//connecting to the database
	mongoose.connect( config.mongo, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		keepAlive: true, keepAliveInitialDelay: 300000
	} );
	
	//Catching Mongo events
	mongoose.connection.on( "connected", () => {
		streamKonsole.log( `${currentDate} => Caden-San is now connected to the database !` );
	} );
	
	mongoose.connection.on( "disconnected", () => {
		streamKonsole.log( `${currentDate} => Caden-San has disconnected from the database !` );
	} );
	
	//Not necessary I think....
	/*mongoose.connection.on( "error", ( error ) => {
		streamKonsole.log(
			`${currentDate} => Caden-San encountered an error with the connection to the database ! Error : ${error}`,
		);
	} );*/
	
	//Starting the client
	const client = new Client();
	client.start( config.token )
	  .then( r => {
		console.log(`${currentDate} => Starting Caden-San Client : ${r}...`)
		streamKonsole.log(`${currentDate} => Starting Caden-San Client : ${r}...`)
	});
	
} catch ( e ) {
	//Handling errors
	streamKonsole.log( `${currentDate} => Error while initializing connection : ${e}` );
	Sentry.captureException( e );
} finally {
	transaction.finish();
	streamKonsole.log( "Connection to MongoDB successfully established !" );
	streamKonsole.log( "Connection to Sentry successfully established !" );
}

//Prevent from crashing on uncaught Exception from the try catch
process.on( "uncaughtException", ( err ) => {
	Sentry.captureException(err);
	console.log( `${currentDate} => Uncaught Exception : ${err}` );
	streamKonsole.log( `${currentDate} => Uncaught Exception : ${err}` );
} );
