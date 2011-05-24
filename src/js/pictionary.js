(function () {
        
    var comms = PIC.comms('127.0.0.1').start(),
        pages = PIC.pages('#page'),
        name = '';
    
    
    // Add all pages
    pages.add('/enter-name', '/src/html/enter-name.html', function () {
        $('#name').val(name)
        $('#enterName').submit(function (e) {
            e.preventDefault();
            name = $('#name').val()
            pages.open('/overview');
        });
    });
    pages.add('/overview', '/src/html/overview.html', function () {
        $('.name').text(name);    
    });
    pages.add('/set-word', '/src/html/set-word.html');
    pages.add('/view-word', '/src/html/view-word.html');
    pages.add('/guess-word', '/src/html/guess-word.html');
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

    
    // Navigation functionality
    $('nav a').click(function (e) {
        var url = $(this).attr('href');
        history.pushState(null, null, url);
        pages.open(url);
        e.preventDefault();
    });
    

}());