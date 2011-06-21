(function () {
    var url = document.URL.replace(/http:\/\/([a-zA-Z0-9\.\-\_]+)\/?/, '$1'),
        comms = PIC.comms(url).start(),
        pages = PIC.pages('#page'),
        name = '',
        word = '',
        guess = '',
        chat = PIC.chat(comms);
        teams = {}
    
    
    // Add all pages
//    pages.add('/enter-name', '/src/html/enter-name.html', function () {
//        $('#name').val(name).focus();
//        $('#enterName').submit(function (e) {
//            e.preventDefault();
//            name = $('#name').val();
//            comms.send({
//                name: name
//            })
//            $('#self').text(name);
//            $('#username').val(name);
//            pages.open('/overview');
//        });
//    });
//    
//    pages.add('/overview', '/src/html/overview.html', function () {
//        $('#teamA').empty()
//        for (uid in teams.a) {
//            $('#teamA').append('<li>' + teams.a[uid]+ '</li>')
//        }
//        
//        $('#teamB').empty()
//        for (uid in teams.b) {
//            $('#teamB').append('<li>' + teams.b[uid]+ '</li>')
//        }
//    });
    
    pages.add('/set-word', '/src/html/set-word.html', function() {
    	$('#word').val(word);
    	$('#enterWord').submit(function (e) {
    		e.preventDefault();
    		word = $('#word').val();
    		pages.open('/view-word');
    	});
    });
    
    pages.add('/view-word', '/src/html/view-word.html', function() {
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
    
    // Navigation functionality
    $('nav a').click(function (e) {
        var url = $(this).attr('href');
        pages.open(url);
        e.preventDefault();
    });
    
    
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
    
    // Chat functionality
    chat.init();
    $('#chat').submit(function (e) {
		e.preventDefault();
		chat.sendMsg();
	});
    
    $('#startGame').submit(function (e) {
    	console.log('TEST');
    	e.preventDefault();
    	pages.open('/set-word');
    });
    
    comms.message(function (data) {

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
            pad.step(data.step);
        }
        
        //Teams
        if (data.teams) {
            teams = data.teams;
            
            $('#teamA').empty();
            console.log(teams.a);
            for (uid in teams.a) {
                $('#teamA').append('<li>' + teams.a[uid]+ '</li>')
            }
            
            $('#teamB').empty()
            for (uid in teams.b) {
                $('#teamB').append('<li>' + teams.b[uid]+ '</li>')
            }
        }
        
        //Draw
        if (data.draw) {
            //pad.add(data.draw);
        }
    })
    

}());