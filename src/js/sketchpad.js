var PIC = PIC || {};

PIC.createPad = function (id) {
	
	var canvas = document.getElementById( id ),
        context = canvas.getContext("2d"),
        cWidth = canvas.width,
        cHeight = canvas.height;

    var $canvas = $('canvas'),
        prevX = 0,
        prevY = 0,
        lineCoords = [];
   
    context.lineWidth = 4;
    
    $canvas.mousedown(function(e){
        prevX = e.pageX;
        prevY = e.pageY;
        
        lineCoords.push({
            ins: 'pendown',
            x: prevX,
            y: prevY
        });
        
        $canvas.bind('mousemove', function(e) {
            lineCoords.push({
                ins: 'lineto',
                x: e.pageX,
                y: e.pageY
            });

            draw(lineCoords);
        });
        
    });
    
    $canvas.mouseup(function(e){
        lineCoords.push({
            ins: 'penup'
        });
        $canvas.unbind('mousemove');
    });
    
    var draw = function(coords){
        context.clearRect(0,0,cWidth,cHeight)
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
        context.stroke();

    }
	
    // Return some sensible API with which to externally control the sketchpad
    return {
        
        // Instructions
        penDown: function () {
            prevX = e.pageX;
            prevY = e.pageY;
            
            lineCoords.push({
                ins: 'pendown',
                x: prevX,
                y: prevY
            });
        },
        penUp: function () {
            lineCoords.push({
                ins: 'penup'
            });
        },
        moveTo: function (x, y) {
            
            lineCoords.push({
                ins: 'lineto',
                x: e.pageX,
                y: e.pageY
            });
??????
            
            if (isPenDown) {
                context.lineTo(coords[i].x, coords[i].y);
            } else {
                context.moveTo(coords[i].x, coords[i].y);
            }        
        },
        
        // Events
        onPenDown: function (callback) {
            
        },
        onPenUp: function (callback) {
            
        },
        onMove: function (callback) {
            
        }
    }
}


    