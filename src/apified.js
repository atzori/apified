var Promise = require('bluebird'),
	colors = require('colors')

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
	//f = Promise.promisify(f)
	var error = 'no info available'
	try {
		return Promise.try(function() {return f.apply(null,params)})
		/*ret = {result: f.apply(null,params)}
		*/
	} catch(err) {
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

function apified(f) {
	var info = functionInfo(f)

	var express = require('express'),
		app = express()
	
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});
	app.get('/'+info.name, function (req, res) {
		var params = computeparams(info.args,req.query)
		
		callfunction(f,params)
		.then(function(data) {
			if(data === null || typeof data === 'undefined') { data = "" }
			data = (typeof data === 'object')? data : {result:data}	
			res.json(data);
		})
		.catch(function(err) {
			res.status(400).json({error:err})
		})
	});
	
	var server = app.listen(process.env.PORT || 3000, function () {
		var host = server.address().address;
		var port = server.address().port;
		
		console.log(
			"%s has been " + colors.red('apified') +" at "+
			colors.magenta("http://%s:%s/%s") +"\nAccepting"+
			" the following GET parameters: %s\n",
			colors.cyan(info.name), host, port, info.name,info.args.map(function(e) {return colors.cyan(e)}).join(', '));
	});
	return {
		host: server.address().address,
		port: server.address().port,
		api: info.name,
		params: info.args 
	}
}

module.exports = apified

