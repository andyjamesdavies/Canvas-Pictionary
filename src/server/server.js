var http = require('http'),
    fs = require('fs'),
    io = require('socket.io'),
    exec = require('child_process').exec,
    server,
    socket,
    mimeTypes = {
        html: 'text/html',
        css: 'text/css',
        js: 'text/javascript',
        jpg: 'image/jpeg',
        png: 'image/png'
    },
    users = {},
    teams = {
        a: {},
        b: {}
    };

server = http.createServer(function (request, response) {
    var url = request.url,
        type = mimeTypes[url.replace(/.*\.([a-zA-Z]+)$/g, '$1')],
        cookies = {};
    
    if (url === '/') {
        url = '/src/html/index.html'
    }
    if (url === '/favicon.ico') {
        response.writeHead(404, {'Content-Type': 'text/html'}); 
        response.end('No such page');
        return;
    }
    if (request.headers.cookie) {
        request.headers.cookie.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=');
            cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
        });
        console.log(cookies)
    }
    
    fs.readFile('../../' + url, 'binary', function (err, file) {
        if (!file) {
            console.log('ERR', url, err)
        }
        response.statusCode = 200;
        response.setHeader('Content-Type', type); 
        if (!cookies.uid) {
            exec('uuidgen', function (error, stdout, stderr) {
                response.setHeader('Set-Cookie', 'uid=' + stdout);
                response.end(file);
                //return;
            })
        } else {
            response.end(file);
        }
    })
});

server.listen(80);

var flag = 0;


// Socket business
socket = io.listen(server); 
socket.on('connection', function (client) {
    
    console.log('We have connection!')

    client.on('message', function (data) {
        var cookiez = {},
            uid;
            
        // New name has been received
        if (data.name) {
            console.log('Hi, I am a socket', client.request.headers.cookie);
            
            // The below duplicates functionality further up in this document.
            // Need to consolidate
            client.request.headers.cookie.split(';').forEach(function( cookie ) {
                var parts = cookie.split('=');
                cookiez[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
            });
            uid = cookiez.uid;

            // If the user isn't a team, assign to a team.
            // Need to consider the case of a user changing name
            if (!(teams.a[uid] || teams.b[uid])) {
                teams[flag ? 'b' : 'a'][uid] = data.name;
                flag = flag ? 0 : 1;
            } else {
                teams[(teams.a[uid] ? 'a' : 'b')][uid] = data.name;
            }
            
            
            // add user to team with fewer players, or random
            console.log(teams)            
            users[cookiez.uid] = data.name;
            socket.broadcast({
                users: users,
                teams: teams
            })
        }
        
    }) 
    client.on('disconnect', function () {} ) 
}); 

