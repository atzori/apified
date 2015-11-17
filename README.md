# APIfied
Serves Web API out of JavaScript functions.


## Usage

```
var apified = require('./apify')

function mycoolfunction(number, anotherNumber) {
	return number + anotherNumber
}


var APIserver = apified(mycoolfunction)

```

Now your Web API is running. 
To test it, go at [localhost:3000/mycoolfunction?number=5&number=9](http://localhost:3000/mycoolfunction?number=5&number=9) 
and get the valid JSON `{"result":"14"}`.

## Options