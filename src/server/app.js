var server = require('./server.js')
    players = require('./players.js'),
    teams = require('./teams.js'),
    srcDir = './../../src'; 

server.start();
/*
server.handle('/hello', function () {
    console.log('Inside the handler')
})


server.handle('*', function (url) {
    server.reply(url);
})

*/
/*server.handle('', function () {
    server.reply(404, '/404.html');    
})
server.handle('/', function () {
    server.reply('/index.html');
})
server.handle('/favicon.ico', function () {
    server.reply('');
})
server.handle('*', function (url) {
    server.reply(url)
})

/* 
app.server('127.0.0.1');
app.start();

app.handle('/', function (response) {
    app.fetch('/index.html');
});

app.handle('/favidon.ico', function () {
    app.fetch('');
});

app.handle('*', function (url) {
    app.fetch('url');
});
 
 

app.message('teams', function () {})
app.message('setName', function (name) {})
app.message('setReadiness', function (readiness) {})




*/