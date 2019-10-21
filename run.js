// USAGE:
// 1. Terminal -> New Terminal (CTRL+SHIFT+`)
// 2. Enter: npm start
// 3. Open your browser, and go to go to: localhost:8000/?file=C:\path\to\file.js
// 4. The response will be the minified file.

const babel = require( '@babel/core' );
const http  = require( 'http' );
const url   = require( 'url' );
const port  = 8000;

console.log( 'Server started. Listening...' );
console.log( 'Go to: localhost:' + port + '/?file=C:\\path\\to\\file.js' );

const writeConversion = filename => new Promise( ( _resolve, _reject ) => {

	console.log( 'Working on ' + filename );

	options = {
		// sourceFileName: filename,
		presets: [
			"minify",
			[
				"@babel/preset-env",
				{
					targets: {
						browsers: ">3.1%"
					},
					useBuiltIns: "entry",
					corejs: "3",
				},
			],
		],
		comments: false,
		babelrc: false,
		configFile: false,
	};

	babel.transformFileAsync( filename, options ).then( result => {
		_resolve( result.code );
	} ).catch( err => {
		console.log( 'Encountered error transforming...' );
		console.log( err.toString() );
		_reject( err );
	} );
} );

http.createServer( ( req, res ) => {
	var queryData = url.parse(req.url, true).query;
	console.log( 'Received request...' );
	res.writeHead( 200, {"Content-Type": "text/plain"} );
	if ( queryData.file ) {
		writeConversion( queryData.file ).then( content => {
			res.write( content );
		} ).catch( err => {
			res.write( '---ERROR  \n\n\n' );
			if ( err ) {
				res.write( err.toString() );
			} else {
				res.write( '...No usable error was specified...' );
			}
		} ).finally( () => {
			res.end();
			console.log( 'Sent response.' );
		});
	} else {
		res.write( 'Specify the file: ?file=C:\\path\\to\\file.js' );
		res.end();
		console.log( 'Sent response.' );
	}
} ).listen( port );
