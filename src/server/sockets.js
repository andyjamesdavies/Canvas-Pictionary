var io = require('socket.io'),
    socket,
    flag = 0,
    teams = {
        a: {},
        b: {}
    },
    users = {},
    game = 'pending',
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

console.log('start')
    socket = io.listen(server).sockets;
    socket.on('connection', function (client) {

        if (Object.keys(users).length >= 4) {
        	game = 'ready';
        }
    	
    	//send initial data about session
    	socket.json.send({
    		users: users,
    		teams: teams,
            game: game
    	});
    	
        client.on('message', function (data) {
            var cookies = {},
                uid;

            // New name has been received
            if (data.name) {
            	
            	//Version 0.7.x does not have access the client.request.
                //cookies = getCookies(client.request.headers.cookie)
                uid = client.id;
    
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
                
                if (Object.keys(users).length >= 4) {
                	game = 'ready';
                }
                
                socket.json.send({
                    users: users,
                    teams: teams,
                    game: game
                })
                
            }
            
            if (data.chat) {
                socket.json.send(data)
            }
            
            if (data.step) {
                client.broadcast.json.send(data);
            }
            
            if (data === 'Can i have a drawing please?') {
                client.json.send({drawing: drawing})
            }
    
        });
        
        client.on('disconnect', function () {
        	
        	//get user id
        	uid = client.id;
        	
        	//remove from teams;
        	if (teams.a[uid]) {
        		delete teams.a[uid];
        	} else if (teams.b[uid]) {
        		delete teams.b[uid];
        	}
        	delete users[uid];
        	
            if (Object.keys(users).length < 4) {
            	game = 'pending';
            }
        	
        	//send an updated team list to all other users
        	socket.json.send({
        		users: users,
        		teams: teams,
        		game: game
        	});
        } );
    }); 

}