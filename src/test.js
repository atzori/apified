var apified = require('./apified')

/** whatever it is */
function mycoolfunction(number, anotherNumber) {
	if(number==0) throw "i don't like zero"
	return number + anotherNumber
}

function mycoolfunctionWithCallback(number, anotherNumber,cb) {
	if(number==0) cb("i don't like zero")
	else cb(null,number + anotherNumber)
}

var apiInfo = apified(mycoolfunction)
//console.log(apiInfo)
