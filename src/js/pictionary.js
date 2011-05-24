(function () {
        
    var pad = PIC.createPad('myCanvas'),
        comms = PIC.comms('127.0.0.1').start(); 
    
    comms.connect(function () {
        comms.send('Hello server!')
    });
    
    comms.message(function (data) {
        var obj = {};
        for (i in data.inst) {
            obj = data.inst[i];
            console.log(obj);
            if (obj.ins) {
                switch(obj.ins) {
                    case 'down':
                        
                        pad.penDown(obj.x, obj.y);
                        break;
                    case 'up':
                        pad.penUp(obj.x, obj.y);
                        break;
                    case 'move':
                        pad.moveTo(obj.x, obj.y);
                        break;
                }
            }
        }
        //console.log('Just in from the server:', data);
    });
    
    //setInterval(comms.sendPath, 50);    
    
    $('#canvasClear').click(function(e) {
        e.preventDefault();
        if ( confirm('This will clear your canvas') ) {
            pad.reset();
        }
    });

}())