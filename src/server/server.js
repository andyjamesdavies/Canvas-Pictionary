var http = require('http'),
    fs = require('fs'),
    io = require('socket.io'),
    server,
    socket,
    mimeTypes = {
        html: 'text/html',
        css: 'text/css',
        js: 'text/javascript'
    }

server = http.createServer(function (request, response) {
    var url = request.url,
        type = mimeTypes[url.replace(/.*\.([a-zA-Z]+)$/g, '$1')];
    
    if (url === '/') {
        url = '/src/html/index.html'
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

// Socket business
socket = io.listen(server); 
socket.on('connection', function (client) { 
    console.log('We have connection!')
    client.send('Hello client!')
    var path = {};
    path.inst = [
                        {ins:'move', x:10, y:10},
                        {ins:'down', x:10, y:10},
                        {ins:'move', x:100, y:100},
                        {ins:'up', x:10, y:10}
                       ];
    
    client.send(path)
                        
    client.on('message', function(data){
        socket.broadcast(data)
    }) 
    client.on('disconnect', function(){ }) 
}); 

