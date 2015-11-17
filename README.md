# APIfied
Serves Web API out of JavaScript functions.


## Usage

```
var apified = require('./apify')

function mycoolfunction(number, anotherNumber) {
	return number + anotherNumber
}


apified(mycoolfunction) // let's play!

```

Now your Web API server is up! 

Checkout the service at [localhost:3000/mycoolfunction?number=5&number=9](http://localhost:3000/mycoolfunction?number=5&number=9) 
and get the valid JSON `{"result":"14"}`.
The server supports [Cross-Origin Resource Sharing (CORS)](http://www.w3.org/TR/cors/) so the service can also be easily queried from the browser.

## Install

	npm install "git+ssh://git@bitbucket.org:atzori/apified.git" --save

## Development

	npm run devstart 	# run the test example (running the server)
	npm test 			# execute a GET request using curl
