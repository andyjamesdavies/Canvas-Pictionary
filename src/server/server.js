var http = require('http'),
	fs = require('fs'),
    io = require('socket.io'),
    server,
    socket,
	fetch,
	mimeTypes = {
		html: 'text/html',
		css: 'text/css',
		js: 'text/javascript'
	}


server = http.createServer(function (request, response) {
	var url = request.url,
		type = mimeTypes[url.replace(/.*\.([a-zA-Z]+)$/g, '$1')];
	//	mimeType = mimeTypes[url.replace(/\.([a-zA-Z])$/, '\1')];
	
	console.log('URL', url, type)
	
	if (url === '/') {
		url = 'src/html/index.html'
	}
	if (url === '/favicon.ico') {
		fs.readFile('../../' + url, 'binary', function (err, file) {
			response.writeHead(200, {'Content-Type': 'text/html'}); 
			response.end(''); 
		})
	}
	fs.readFile('../../' + url, 'binary', function (err, file) {
		if (!file) {
			console.log('ERR', url, err)
		}
		response.writeHead(200, {'Content-Type': type}); 
		response.end(file); 
	})
});

server.listen(80);


/*

 = function (url, callback) {
	
}


render = function (path) {
	var extension = path.replace(/\.([a-zA-Z])$/, '\1')
	var mime = mimeTypes[extension];
	
	fs.readFile('path', 'binary', function (err, file) {
		response.writeHead(200, {'Content-Type': mime}); 
		response.end(file); 
	})
}

	

server = http.createServer(function (request, response) {
	console.log(request.url)
	handle(request);	
});

handle = function (request, response) {
	
}

server.listen(80);


handler('/', function (response) {
	render('../html/index.html')
})

fetch('/', function (file, response) {
	
})

*/
/*

  
socket = io.listen(server); 
socket.on('connection', function (client) { 
    
    client.send('YOOOO')        
    console.log('We have connection!')
    
    client.on('message', function(data){
        console.log('Message! ', data)
        socket.broadcast(data)
    }) 
    client.on('disconnect', function(){ }) 
}); */