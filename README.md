# APIfied
Serves Web API out of JavaScript functions.

## Install

	npm install "git+ssh://git@bitbucket.org:atzori/apified.git" --save

## Getting Started

```
var apified = require('apified')

function mycoolfunction(number, anotherNumber) {
	return number + anotherNumber
}


apified(mycoolfunction) // let's play!

```

Now your Web API server is up! 

Checkout the service at [localhost:3000/mycoolfunction?number=5&number=9](http://localhost:3000/mycoolfunction?number=5&number=9) 
and get the valid JSON `{"result":"14"}`.


## Features
`apified` has a lot of cool features.

  - function argument names are recognized and used as get parameter names
  - supports both named and anonymous functions
  - works with async functions (both callback-based and thenable/promises): 
  callbacks are recognized when the last parameter of a function is named `callback`
  - if the output is an object, it will be returned as valid JSON, otherwise a `{"result": FUNCTION_RESULT}` JSON is returned
  - in case of errors (such as exceptions) an `{"error":ERROR_DESCRIPTION_STRING}` is returned with HTTP 400
  - it handles argument numbers transparently (converting strings to numbers when appropriate).
  - supports [Cross-Origin Resource Sharing (CORS)](http://www.w3.org/TR/cors/) so the service can also be queried easily from the browser.
  - it even works with sync functions that do not return any value, returing their stdout (`console.log`) instead

## Options

	apified(function, [options])
	
where `options` may be a string the set the name of the service 
(overriding the default which is equal to the name of the function). 
Also useful for anonymous functions or deep paths such as `my/cool/service`.

Alternatively it can be an object with the following optional parameters:

  - *name*: the path of the service (default: function name)
  - *port*: the port used by the service (default: the value in the environment variable PORT, or 3000 if unsed)
  - *cors*: set/unset CORS (default: true)
  
## Development

	npm run devstart 	# run the test example (running the server)
	npm test 			# execute a GET request using curl

