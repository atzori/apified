
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
		cors: true,
		workers: true, 
		cache: false
	}

	options = extend({}, defaultOptions,  options)

	if (options.workers === true) {
		options.workers = 2* require('os').cpus().length
	} else if(options.workers === false) {
		options.workers = 1		
	} 

	info.name = options.name
	
	if (info.args.length>0 
			&& info.args[info.args.length-1].toLowerCase() === "callback") {
		// must be promisified
		f = Promise.promisify(f)
		info.args.pop()
	}
	
	var express = require('express'),
		app = express()
	
	app.use(function(req, res, next) {
		res.header("X-Powered-By", "Apified")
		next()
	})
	if (options.cors) {
		app.use(function(req, res, next) {
				res.header("Access-Control-Allow-Origin", "*");
				res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});
	}

	/*
	if(options.cache) {
		var cache = require('connect-cache')
		app.use(cache({rules: [{regex: /.*REMOVETHIS/, ttl: 10  *24*60*60*1000}]}))	
	}*/
	simplecache = {}
	app.all('/'+info.name, function (req, res) {
		var params = computeparams(info.args,req.query)


			if(options.cache && simplecache[params] ) {
				res.status(simplecache[params].code).json(simplecache[params].data)
				return
			}
			
		//setTimeout(function(){		
			callfunction(f, params)
			.then(function(data) {
				if(data === null || typeof data === 'undefined') { data = "" }
				data = (typeof data === 'object')? data : {result:data}	
				if (options.cache) simplecache[params] = {code:200, data: data}
				res.json(data);
			})
			.catch(function(err) {
				if (options.cache) simplecache[params] = {code:400, data: {error:err}}
				res.status(400).json({error:err})
			})
		//}, 3000)
	});

	
	//////// CLUSTER
	function tobeclustered(worker) {
		var server = app.listen(options.port, function (a,b,c,d) {
			var host = server.address().address;
			var port = server.address().port;
			//console.log(server)
			console.log(
				"%s has been " + colors.red('apified') +" at "+
				colors.magenta("http://%s:%s/%s") +"\nWorker %saccepting"+
				" the following GET parameters: %s\n",
					typeof info.name !== 'undefined'?
					"'"+colors.cyan(info.name)+"'":'an anonymous function',
					host, port, info.name,
					options.workers>1?(worker.id + " (pid "+  worker.process.pid+") "):'',
					info.args.map(function(e) {return colors.cyan(e)}).join(', ')
					
				);
		});

		return {
			server: server,
			api: info.name,
			params: info.args 
		}
		
		

	} // tobeclustered
	clusterrific(tobeclustered,options.workers)
		
			
}		


module.exports = apified

function clusterrific(f, workers) {
	var cluster = require('cluster')

	if (workers > 1) {
		// Listen for dying workers
		cluster.on('exit', function (worker) {
			// Replace the dead worker,
			// we're not sentimental
			console.log('Worker ' + worker.id + ' died :(');
			cluster.fork();
					
		});
	}
	if (workers > 1 && cluster.isMaster) {
		//console.log('STARTING CLUSTER MASTER ' + cluster.id);
				
		// Create a worker for each CPU
		for (var i = 0; i < workers ; i += 1) {
			cluster.fork();
		}		
	// Code to run if we're in a worker process
	} else {
		return f(cluster.worker)	
	}	
}