var http = require('http'),
    fs = require('fs'),
    sockets = require('./sockets.js'),
    exec = require('child_process').exec,
    server,
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
    handlers = [],
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
        i,
        r;
    
    for (i=0; i < handlers.length; i++) {
        r = RegExp(handlers[i].pattern)
        if (r.test(url)) {
            handlers[i].callback();
            console.log('Winning url: ', url, ' and its handler: ' + handlers[i].pattern)
        }
    }
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end('Hello wolrd');
    
    /*
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
    })*/
});





exports.start = function () {
    server.listen(80);
    sockets.start(server);
};
exports.stop = function () {};

exports.handle = function (pattern, callback) {
    handlers.push({
        pattern: pattern,
        callback: callback
    });
}
