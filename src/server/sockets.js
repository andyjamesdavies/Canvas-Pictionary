var io = require('socket.io'),
    socket,
    flag = 0,
    teams = {
        a: {},
        b: {}
    },
    users = {},
    drawing = [];
    getCookies = function (str) {
        var cookies = [];
        str.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=');
            cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
        });
        return cookies;
    };

// Socket business
exports.start = function (server) {
    socket = io.listen(server);

    socket.on('connection', function (client) {
    
        client.on('message', function (data) {
            
            var cookies = {},
                uid;
                
            // New name has been received
            if (data.name) {
                
                console.log(data.name)
    
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
            
            if (data.chat) {
                socket.broadcast(data)
            }
            
            if (data.step) {
                socket.broadcast(data, client.sessionId);
            }
            
            if (data === 'Can i have a drawing please?') {
                client.send({drawing: drawing})
            }
    
        }) 
        client.on('disconnect', function () {} ) 
    }); 

}