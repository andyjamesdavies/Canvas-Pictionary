
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");

    var $canvas = $('canvas'),
        prevX = 0,
        prevY = 0,
        lineCoords = [];
   
    context.lineWidth = 4;
    
    $canvas.mousedown(function(e){
        prevX = e.pageX;
        prevY = e.pageY;
        
        $canvas.bind('mousemove', function(e) {
            
            lineCoords = [
                              {
                                  ins: 'pendown',
                                  x: 10,
                                  y: 10
                              },
                              {
                                  ins: 'lineto',
                                  x: 100,
                                  y: 100
                              },
                              {
                                  ins: 'lineto',
                                  x: 90,
                                  y: 150
                              },
                              {
                                  ins: 'penup'
                              }
                          ];
            
            draw(lineCoords);
//            context.beginPath();
//            context.moveTo(prevX, prevY);
//            context.lineTo(e.pageX, e.pageY);
//            
//            context.stroke();
//            
//            prevX = e.pageX;
//            prevY = e.pageY;
//            
//            context.closePath();
        });
        
    });
    
    $canvas.mouseup(function(e){
        $canvas.unbind('mousemove');
    });
    
    
    var draw = function(coords){
        
        for ( var i=0; i < coords.length; i++) {
            switch( coords[i].ins ) {
                case 'pendown':
                    context.beginPath();
                    context.moveTo(coords[i].x, coords[i].y);
                    break;
                case 'lineto':
                    context.lineTo(coords[i].x, coords[i].y);
                    break;
                case 'penup':
                    context.stroke();
                    context.closePath();
                    break;
            }
            
        }
    }