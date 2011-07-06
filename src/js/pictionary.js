(function () {
    var url = document.URL.replace(/http:\/\/([a-zA-Z0-9\.\-\_]+)\/?/, '$1'),
        comms = PIC.comms(url).start(),
        pages = PIC.pages('#page'),
        name = '',
        word = '',
        guess = '',
        chat = PIC.chat(comms),
        teams = {},
        pad;
    
    // Add all pages    
    pages.add('/', '/src/html/home.html', function() { 
    	
    	drawTeamsList(teams);
    	
        //Name Functionality
        $('#name').val(name).focus();
        $('#enterName').submit(function (e) {
            e.preventDefault();
            name = $('#name').val();
            comms.send({
                name: name
            })
            $('#self').text(name);
            $('#username').val(name);
        });
        
        $('#startGame').submit(function (e) {
        	e.preventDefault();
        	pages.open('/set-word');
        });
    });    
        
    pages.add('/set-word', '/src/html/set-word.html', function() {
    	$('#word').val(word);
    	$('#enterWord').submit(function (e) {
    		e.preventDefault();
    		word = $('#word').val();
    		pages.open('/draw-word');
    	});
    });
    
    pages.add('/draw-word', '/src/html/draw-word.html', function() {
    	$('.word').text(word);
        pad = PIC.createPad('#myCanvas');
        pad.onStep(function (step) {
            comms.send({
                step: step
            });
        })
        comms.connect(function () {
            comms.send('Hello server!');
        });
        comms.message(function (data) {
            console.log('Just in from the server:', data);
        });
        $('#clear').click(function () {
            pad.reset();
        })
    });
    
    pages.add('/guess-word', '/src/html/guess-word.html', function() {
    	pad = PIC.createPad('#myCanvas');
        pad.receive();
        $('#guess').val(guess);
    	$('#enterGuess').submit(function (e) {
    		e.preventDefault();
    		guess = $('#guess').val();
    		if ( guess === word ) {
    			$('#feedback').text('Correct!');
    		} else {
    			$('#guess').val('');
    			$('#feedback').text('Please try again...');
    		}
    	});
        
        $('#fetchDrawing').click(function () {
            comms.send('Can i have a drawing please?')
        
        })
    });
    
    pages.add('/watch-team', '/src/html/watch-team.html');   
    
    pages.open('/');
    
    // Navigation functionality
    $('nav a').click(function (e) {
        var url = $(this).attr('href');
        
        pages.open(url);
        e.preventDefault();
    });
    
    // Chat functionality
    chat.init();
    $('#chat').submit(function (e) {
		e.preventDefault();
		chat.sendMsg();
	});

    
    comms.message(function (data) {
    	console.log(data);
    	//Users
        if (data.users) {
            var users = '';
            for (u in data.users) {
                users += data.users[u] + ' ';
            }
            $('#others').text(users)
        }
        
        //Step
        if (data.step) {
            console.log('hello, step')
            pad.step(data.step);
        }
        
        //Teams
        if (data.teams) {
        	teams = data.teams;
        	
            drawTeamsList(data.teams);
        }
        
        
        if (data.game !== undefined) { 
        
	        if (data.game.status === 'ready' && data.game.secondsToStart > 0) {
	        	
	        	//if the game status is posted, clear any timer running
	        	clearInterval(window.intId);
	        	
	        	//create new timer
	        	window.intId = setInterval(function() {
	        		
	        		//update timer feedback
	            	$('#timer').html('The game will begin in ' + data.game.secondsToStart + ' seconds');
	        		
	        		//decrement timer value
	        		data.game.secondsToStart--;
	
	        		//if timer is at zero or below, tell server timer is over and 
	        		//break out of loop
		            if (data.game.secondsToStart <= 0) {
		            	clearInterval(window.intId);
		            	data.game.secondsToStart = 0;
		            	comms.send({ game : data.game });
		            	return;
		            }
	        	}, 1000);
	        
	        } else if (data.game.status === 'inProgress') {
	        
	        	//clear any timer loops and handle next page
	        	clearInterval(window.intId);
	        	pages.open('/set-word');
	        
	        } else {
	        	
	        	//clear any timer loops and update timer feedback
	        	clearInterval(window.intId);
	        	$('#timer').html('Waiting for players to join (min 2 players per team)');
	        }
        }
        
        //Draw
        if (data.draw) {
            //pad.add(data.draw);
        }
    })
    
    function drawTeamsList(teams) {
        $('#teamA').empty();
        for (uid in teams.a) {
            $('#teamA').append('<li>' + teams.a[uid]+ '</li>')
        }
        
        $('#teamB').empty()
        for (uid in teams.b) {
            $('#teamB').append('<li>' + teams.b[uid]+ '</li>')
        }
    }
    

}());