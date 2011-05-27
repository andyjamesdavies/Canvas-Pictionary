var PIC = window.PIC || {};


PIC.createPad = function (padSelector) {
    
    var $canvas = $(padSelector),
        $doc = $(document),
        context = $canvas[0].getContext('2d'),
        penX = 0,
        penY = 0,
        isPenDown = false,
        path = {};
   
    $canvas.clear = function() {
        context.clearRect(0,0,10000,10000);
    };
    
    // The path inst is the array that stores the pad's drawing history    
    path.inst = [];
    
    // Add instruction to the pad. Accepted values: 'up', 'down', 'move, x, y'
    path.add = function (word, x, y) {
        var ins = {}
        ins.ins = word;
        if (x && y) {
            ins.x = x;
            ins.y = y;
        }
        this.inst.push(ins);
        this.render();
    };
    
    // Clear the canvas and redraw the pad's entire sketch history
    path.render = function () {
        var i, len, ins;
            
        $canvas.clear();
        
        for (i=0, len=this.inst.length; i < len; i++) {
            ins = this.inst[i]
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
    
    path.clear = function () {
        this.inst = [];
    };
    
    // Setup the line styling    
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    // Mouse events
    $canvas.mousedown(function (e) {
        var coords = $canvas.offset();
        path.add('move', e.pageX - coords.left, e.pageY - coords.top);
        path.add('down');
        $doc.bind('mousemove', function (e) {
            coords = $canvas.offset();
            path.add('move', e.pageX - coords.left, e.pageY - coords.top);
        })
    })
    $doc.mouseup(function (e) {
        path.add('up');
        $doc.unbind('mousemove');
    })
    
    
    // Return the sketchpad's API
    return {
        penDown: function (x, y) {
            path.add('down', x, y);
            path.render();
        },
        penUp: function (x, y) {
            path.add('up');
            path.render();
        },
        moveTo: function (x, y) {
            path.add('move', x, y);
            path.render();
        },
        reset: function() {
            $canvas.clear();
            path.clear();
        },
        getPath: function() {
            return path.inst;
        }
    }
}
   