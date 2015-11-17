var apified = require('./apified')

/** whatever it is */
function f1(number, anotherNumber) {
	if(number==0) throw "i don't like zero"
	return number + anotherNumber
}

function f2(number, anotherNumber, callback) {	
	if(number==0) callback("i don't like zero")
	else setTimeout(function() {callback(null,number + anotherNumber)},2000)
}

function f3(number, anotherNumber) {	
	if(number!=0) 
		//console.log(number + anotherNumber)
		console.log("is it working?")
}


function mycoolfunction(number, anotherNumber, callback) {
	return f2(number, anotherNumber, callback);
}


var apiInfo = apified(f2,'mycoolfunction')
