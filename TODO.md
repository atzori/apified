# TODO

 - tests! https://strongloop.com/strongblog/how-to-test-an-api-with-node-js/
 - logging with widsom
 - REDIRECT stdout as in http://www.letscodejavascript.com/v3/blog/2014/04/the_remarkable_parts
	for async functions (for sync is done)
 - options 
	- onerror = function(err) {return ""} | "this is the real error" | {result:correct} ???
	- argnames = override function argument names
	- callback = true (=ultimo parametro)| number (indice 0= primo parametro)
	- jsonp to set jsonp = default false (since cors is true)
	- stdout = ['auto','true','false'] // default auto (auto means it is used only if function does not return)
	- stderr = ['auto','true','false'] // default false 
	- raw = ['true', 'false'] // default false (always serve json); with true returns raw strings when they are returned (mimetype is autodetermined) 
	- mimetype = ['auto' , string] // default auto, otherwise it will always be the provided string
	- result = string // default = "result" // allow to change the "result" attribute of the json
	- parallel = true // false, true [1-n] // how many instances in parallel? false=1 auto/true= twice the number of processors  
