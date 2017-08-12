var path = require('path');
var express = require('express');

var server = express();
server.use(express.static(path.resolve(__dirname,'www')));

server.get('/test', function(req, res){
	res.writeHead(200, { 'Content-Type': 'text/plain' });
  	res.end('Hello World\n');
});

var port = process.env.PORT || 1337;
server.listen(port, function() {
	console.log("server listening on port " + port);
});
