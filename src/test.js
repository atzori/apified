var apified = require('./apified')

/** whatever it is */
function f1(number, anotherNumber) {
	if(number==0) throw "i don't like zeros"
	return number + anotherNumber
}

function f2(number, anotherNumber, callback) {	
	if(number==0) callback("i don't like zeros")
	else setTimeout(function() {callback(null,number + anotherNumber)},2000)
}

function f3(number, anotherNumber) {	
	if(number>0) 
		//console.log(number + anotherNumber)
		console.log("is it working?")
	else if(number==0) throw "i don't like zeros"	
	else if(number < -1) return {'cool':'stuff, sum was '+ (number+anotherNumber)}
	// -1 is ignored
}


function mycoolfunction(number, anotherNumber, callback) {
	return f2(number, anotherNumber, callback);
}


var apiInfo = apified(f3,'mycoolfunction')
