(function () {
        
    var comms = PIC.comms('127.0.0.1').start(),
        pages = PIC.pages('#page');
    
    $('button').click(function () {
        pages.open('foo', function () {
            var pad = PIC.createPad('#myCanvas');
            comms.connect(function () {
                comms.send('Hello server!')
            })
            comms.message(function (data) {
                console.log('Just in from the server:', data);
            })        
        })
        
    })
    
    

}())