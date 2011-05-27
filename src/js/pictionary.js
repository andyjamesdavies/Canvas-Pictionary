(function () {    
        
    var comms = PIC.comms('127.0.0.1').start(),
        pages = PIC.pages('#page'),
        name = '',
        word = '',
        guess = '';
        teams = {}
    
    // Add all pages
    pages.add('/enter-name', '/src/html/enter-name.html', function () {
        $('#name').val(name).focus();
        $('#enterName').submit(function (e) {
            e.preventDefault();
            name = $('#name').val();
            comms.send({
                name: name
            })
            $('#self').text(name);
            pages.open('/overview');
        });
    });
    
    pages.add('/overview', '/src/html/overview.html', function () {
        $('#teamA').empty()
        for (uid in teams.a) {
            $('#teamA').append('<li>' + teams.a[uid]+ '</li>')
        }
        
        $('#teamB').empty()
        for (uid in teams.b) {
            $('#teamB').append('<li>' + teams.b[uid]+ '</li>')
        }
    });
    
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
        var pad = PIC.createPad('#myCanvas');
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
    });
    
    pages.add('/watch-team', '/src/html/watch-team.html');

    pages.add('/chat-client', '/src/html/chat-client.html', function() {
    	var chat = PIC.chat(comms);
    	
    	chat.init();
    	
        $('#msg').focus();  
        $('#name').val(name);
    	
    	$('#chat').submit(function (e) {
    		e.preventDefault();
    		chat.sendMsg();
    	});
    });    
    
    // Navigation functionality
    $('nav a').click(function (e) {
        var url = $(this).attr('href');
        
        pages.open(url);
        e.preventDefault();
    });
    
    
    comms.message(function (data) {
        if (data.users) {
        console.log('We got a message!', data)
            var users = '';
            for (u in data.users) {
                users += data.users[u] + ' ';
            }
            $('#others').text(users)
        }
        
        if (data.teams) {
            teams = data.teams;
            pages.open('/overview')
        }
    })
    

}());