(function () {
        
    var comms = PIC.comms('127.0.0.1').start(),
        pages = PIC.pages('#page'),
        name = '',
        word = '',
        guess = '';
    
    // Add all pages
    pages.add('/enter-name', '/src/html/enter-name.html', function () {
        $('#name').val(name);
        $('#enterName').submit(function (e) {
            e.preventDefault();
            name = $('#name').val();
            pages.open('/overview');
        });
    });
    
    pages.add('/overview', '/src/html/overview.html', function () {
        $('.name').text(name);    
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
    
    pages.add('/sample', '/src/html/sample.html', function () {
        var pad = PIC.createPad('#myCanvas');
        comms.connect(function () {
            comms.send('Hello server!');
        });
        comms.message(function (data) {
            console.log('Just in from the server:', data);
        });        
    });

    pages.add('/chat-client', '/src/html/chat-client.html', function() {
    	var chat = PIC.chat(comms);
    	
    	chat.init();
    	$('#name').val(name);
    	
    	$('#chat').submit(function (e) {
    		e.preventDefault();
    		chat.sendMsg();
    	});
    });    
    
    // Navigation functionality
    $('nav a').click(function (e) {
        var url = $(this).attr('href');
        history.pushState(null, null, url);
        pages.open(url);
        e.preventDefault();
    });
    

}());