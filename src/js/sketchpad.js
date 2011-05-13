var PIC = PIC || {};

PIC.createPad = function (id) {
    
    var $canvas = $('#' + id),
        $doc = $(document),
        context = $canvas[0].getContext('2d'),
        penX = 0,
        penY = 0,
        isPenDown = false,
        path = [];
        
    path = [];
    path.add = function (word, x, y) {
        var ins = {}
        ins.ins = word;
        if (x && y) {
            ins.x = x;
            ins.y = y;
        }
        this.push(ins);
        this.render();
    };
    path.render = function () {
        var i, len, ins;
            
        context.clearRect(0,0,10000,10000);
        
        for (i=0, len=this.length; i < len; i++) {
            ins = this[i]
            switch( ins.ins ) {
                case 'down':
                    context.beginPath();
                    isPenDown = true;
                    break;
                case 'move':
                    if (isPenDown) {
                        context.lineTo(ins.x, ins.y);                        
                    } else {
                        context.moveTo(ins.x, ins.y);
                    }
                    break;
                case 'up':
                    context.stroke();
                    isPenDown = false;
                    break;
            }
        }
        if (isPenDown) {
            context.stroke();
        }
    };
        
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    
    $canvas.mousedown(function (e) {
        path.add('move', e.pageX, e.pageY);
        path.add('down');
        $doc.bind('mousemove', function (e) {
            path.add('move', e.pageX, e.pageY);
        })
    })
    $doc.mouseup(function (e) {
        path.add('up');
        $doc.unbind('mousemove');
    })
    
    return {
        penDown: function () {
            path.add('down');
            path.render();
        },
        penUp: function () {
            path.add('up');
            path.render();
        },
        moveTo: function (x, y) {
            path.add('move', x, y);
            path.render();
        }
    }
}
    
    
/*    
    
    
    
    
    
    
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


*/