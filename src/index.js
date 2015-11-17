
function prova(a,b) {
	
}

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

function apified(f) {
	var info = functionInfo(f)

	var express = require('express');
	var app = express();
	
	app.get('/', function (req, res) {
		res.send('Hello World!');
	});
	
	var server = app.listen(process.env.PORT || 3000, function () {
		var host = server.address().address;
		var port = server.address().port;
		
		console.log('APIfier listening the "'+info.name+'" WebAPI at http://%s:%s/'+
			info.name, host, port);
	});
}


apified(prova)