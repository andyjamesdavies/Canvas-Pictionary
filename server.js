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
    },
    getCookies = function (str) {
        var cookies = [];
        str.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=');
            cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
        });
        return cookies;
    };

server = http.createServer(function (request, response) {
    
    var url = request.url,
        type = mimeTypes[url.replace(/.*\.([a-zA-Z]+)$/g, '$1')],
        cookies = {};
    
    if (url === '/') {
        type = mimeTypes['html'];
        url = '/src/html/index.html';
    }
    if (url === '/favicon.ico') {
        response.writeHead(404, {'Content-Type': 'text/html'}); 
        response.end('No such page');
        return;
    }
    if (request.headers.cookie) {
        cookies = getCookies(request.headers.cookie);
    }
    
    fs.readFile('./' + url, 'binary', function (err, file) {
        if (!file) {
            console.log('ERR', url, err)
        }
        if (!cookies.uid) {
           exec('uuidgen', function (error, stdout, stderr) {
                console.log(typeof stdout)
                response.writeHead(200, {
                    'Set-Cookie': 'uid=' + stdout + ' ',  // doesn't work without trailing space
                    'Content-Type': type
                });
                response.end(file);
            })
        } else {
            response.writeHead(200, { 'Content-Type': type });
            response.end(file);
        }
    })
});

server.listen(80);

var flag = 0;


// Socket business
socket = io.listen(server); 
socket.on('connection', function (client) {
    
    client.on('message', function (data) {
        var cookies = {},
            uid;
            
        // New name has been received
        if (data.name) {

            cookies = getCookies(client.request.headers.cookie)
            uid = cookies.uid;

            // If the user isn't a team, assign to a team.
            // Need to consider the case of a user changing name
            if (!(teams.a[uid] || teams.b[uid])) {
                teams[flag ? 'b' : 'a'][uid] = data.name;
                flag = flag ? 0 : 1;
            } else {
                teams[(teams.a[uid] ? 'a' : 'b')][uid] = data.name;
            }
            console.log(teams)
            // add user to team with fewer players, or random
            users[uid] = data.name;
            socket.broadcast({
                users: users,
                teams: teams
            })
        }
        
        socket.broadcast(data)

    }) 
    client.on('disconnect', function () {} ) 
}); 

