
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");

    var $canvas = $('canvas'),
        prevX = 0,
        prevY = 0;
   
    context.lineWidth = 4;
    
    $canvas.mousedown(function(e){
        prevX = e.pageX;
        prevY = e.pageY;
        
        $canvas.bind('mousemove', function(e) {
            
            context.beginPath();
            context.moveTo(prevX, prevY);
            context.lineTo(e.pageX, e.pageY);
            
            context.stroke();
            
            prevX = e.pageX;
            prevY = e.pageY;
            
            context.closePath();
        });
        
    });
    
    $canvas.mouseup(function(e){
        $canvas.unbind('mousemove');
    });
