/*
TO DO:
	- tests! https://strongloop.com/strongblog/how-to-test-an-api-with-node-js/
	- logging with widsom
	- REDIRECT stdout as in http://www.letscodejavascript.com/v3/blog/2014/04/the_remarkable_parts
	  for async functions (for sync is done)
	- options {
		onerror = function(err) {return ""} | "this is the real error" | {result:correct} ???
		argnames = override function argument names
		callback = true (=ultimo parametro)| number (indice 0= primo parametro)
		jsonp to set jsonp = default false (since cors is true)
		stdout = ['auto','true','false'] // default auto (auto means it is used only if function does not return)
		stderr = ['auto','true','false'] // default false 
		raw = ['true', 'false'] // default false (always serve json); with true returns raw strings when they are returned 
		result = string // default = "result" // allow to change the "result" attribute of the json
		
	}
*/

var Promise = require('bluebird'),
	colors = require('colors'),
	extend = require('extend')

/** given a function f, returns the list of its arguments (array of strings) */
function functionInfo(f) {
	var re = new RegExp('^\\s*function\\s*([^\\s\\(]*)\\s*\\(([^\\)]*)\\)')
	var argstring = re.exec(f.toString())
	if (argstring && argstring.length && argstring.length>=3) {
		return  {
				name: argstring[1].trim(), 
				args:argstring[2].split(',').map(function(e){
					return e.trim()
				})
			}
	}
	else return null
}

function callfunction(f,params) {
	var error = 'no info available'
	try {
		return Promise.try(function() {
			// catch stdout
			var output = [];
			var originalStdout = process.stdout.write;
			process.stdout.write = function(str) {
				output.push(str);
			};
			var result = f.apply(null,params) 
			process.stdout.write = originalStdout;
			
			if (output.length > 0 && 
				(typeof result === 'undefined' || result === null))
				return output.join('\n')
			else return result
				
		})
	} catch(err) {
		//console.error(err)
		error = err
	}
	return Promise.reject(error) // error
}

function isNumber(obj) { return !isNaN(parseFloat(obj)) && !isNaN(Number(obj)) }

function computeparams(args,queryparams) { 
	return args.map(function(param) {
			var value = queryparams[param] 	
			return isNumber(value)?Number(value):value 
		})
}

function apified(f, options) {
	if (typeof options === 'string')
		options = {name: options}
	else if (typeof options !== 'object' || options === null)
		options = {}

	var info = functionInfo(f)
	var defaultOptions = {
		name: info.name,
		port: process.env.PORT || 3000 ,
		cors: true
	}

	options = extend({}, defaultOptions,  options)

	info.name = options.name
	
	if (info.args.length>0 
			&& info.args[info.args.length-1].toLowerCase() === "callback") {
		// must be promisified
		f = Promise.promisify(f)
		info.args.pop()
	}
	
	var express = require('express'),
		app = express()
	
	if (options.cors) {
		app.use(function(req, res, next) {
				res.header("Access-Control-Allow-Origin", "*");
				res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});
	}
	app.get('/'+info.name, function (req, res) {
		var params = computeparams(info.args,req.query)
		
		callfunction(f, params)
		.then(function(data) {
			if(data === null || typeof data === 'undefined') { data = "" }
			data = (typeof data === 'object')? data : {result:data}	
			res.json(data);
		})
		.catch(function(err) {
			res.status(400).json({error:err})
		})
	});
	
	var server = app.listen(options.port, function () {
		var host = server.address().address;
		var port = server.address().port;
		
		console.log(
			"%s has been " + colors.red('apified') +" at "+
			colors.magenta("http://%s:%s/%s") +"\nAccepting"+
			" the following GET parameters: %s\n",
				typeof info.name !== 'undefined'?
				"'"+colors.cyan(info.name)+"'":'an anonymous function',
				host, port, info.name,info.args.map(function(e) {return colors.cyan(e)}).join(', '));
	});
	return {
		host: server.address().address,
		port: server.address().port,
		api: info.name,
		params: info.args 
	}
}

module.exports = apified

