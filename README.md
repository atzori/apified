# APIfied
Let any JavaScript function to be served as a Web API, **in just one line**!

## Install

	npm install atzori/apified

## Getting Started

```javascript
function mycoolfunction(number, anotherNumber) {
	return number + anotherNumber
}

var apified = require('apified')
apified(mycoolfunction) // your API is online

// or, if you prefer one-line, just use the following instead:
//require('apified')(mycoolfunction)
```

Now your Web API server is up! 

Checkout the service at [localhost:3000/mycoolfunction?number=5&number=9](http://localhost:3000/mycoolfunction?number=5&anotheNumber=9) 
and get the valid JSON `{"result":"14"}`.


## Features
`apified` has a lot of cool features.

  - support all HTTP verbs (including GET and POST)
  - function argument names are recognized and used as get parameter names
  - supports both named and anonymous functions
  - works with async functions (both callback-based and thenable/promises): 
  callbacks are recognized when the last argument of the function is named `callback`
  - if the output is an object, it will be returned as valid JSON, otherwise a `{"result": FUNCTION_RESULT}` JSON is returned
  - in case of errors (such as exceptions) an `{"error":ERROR_DESCRIPTION_STRING}` is returned with HTTP 400
  - it handles argument numbers transparently (converting strings to numbers when appropriate).
  - supports [Cross-Origin Resource Sharing (CORS)](http://www.w3.org/TR/cors/) so the service can also be queried easily from the browser.
  - it even works with sync functions that do not return any value, returing their stdout (`console.log`) instead
  - parallel execution using multiple workers (can be disabled)

## Options

	apified(function, [options])
	
where `options` may be a string the set the name of the service 
(overriding the default which is equal to the name of the function). 
Also useful for anonymous functions or deep paths such as `my/cool/service`.

Alternatively it can be an object with the following optional parameters:

  - *name*: the path of the service (default: function name)
  - *port*: the port used by the service (default: the value in the environment variable PORT, or 3000 if unsed)
  - *cors*: set/unset CORS (default: true)
  - *workers*: the number of workers, either an integer &gt;=1 or a boolean; false means one worker, true set 
  the number of workers twice the number of processors (default: true) 
  - *cache*: set/unset the cache (default: false); set a simple in-memory cache (note: there is a different cache for each worker)
  
## Development

	npm run devstart 	# run the test example (running the server)
	npm test 			# execute a GET request using curl

