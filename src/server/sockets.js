var io = require('socket.io'),
    socket,
    flag = 0,
    teams = {
        a: {},
        b: {}
    },
    users = {},
    game = { 
		status:'pending',
		secondsToStart:10,
	},
    drawing = [];

    var getCookies = function (str) {
        var cookies = [];
        str.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=');
            cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
        });
        return cookies;
    };
    
    var updateGameStatus = function(socket, data) {	
    	
    	
    	if ( data.game === undefined) {
    		data.game = game;	
    	}
	    	
    	if (Object.keys(data.users).length >= 4 && data.game.secondsToStart > 0) {
	    	data.game.status = 'ready';
	    		
	    } else if (Object.keys(data.users).length >= 4 && data.game.secondsToStart === 0) {
	    	data.game.secondsToStart = 0;
	    	data.game.status = 'inProgress';
	    } else {
	    	data.game.secondsToStart = 10;
	    	data.game.status = 'pending';
	    }
	    game = data.game;

    	
        socket.json.send({
        	users : users,
        	teams: teams,
        	game : data.game
        });
    };

// Socket business
exports.start = function (server) {
	
    socket = io.listen(server).sockets;
	
    socket.on('connection', function (client) {

    	updateGameStatus(socket, {
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
                	flag = 0;
                	if (Object.keys(teams.a).length > Object.keys(teams.b).length) {
                		flag = 1;
                	}
                	
                    teams[flag ? 'b' : 'a'][uid] = data.name;
                } else {
                    teams[(teams.a[uid] ? 'a' : 'b')][uid] = data.name;
                }
                console.log(teams)
                
                // add user to team with fewer players, or random
                users[uid] = data.name;
                
                updateGameStatus(socket, {
            		users: users, 
            		teams: teams, 
            		game: game
            	});
                
            }
            
            if (data.chat) {
                socket.json.send(data)
            }
            
            if (data.game) {
            	updateGameStatus(socket, {
            		users: users,
            		teams: teams,
            		game: data.game
            	});
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
        	
        	updateGameStatus(socket, {
        		users: users, 
        		teams: teams, 
        		game: game
        	});
        } );
    }); 

}