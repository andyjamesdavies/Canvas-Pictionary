(function () {
    
  /*  var PIC = window.PIC = window.PIC || {},
    
        Pad = function (id) {
            this.penDown = function () {
                
            }
            this.penUp = function () {
                
            }
            this.moveTo = function () {
                
            }
        }

    
    PIC.createPad = function (id) {
        
        var pad = new Pad(id);
        
        
        return new Pad(id);
        
        var pad = {
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
            };
            
        
    }
    
    
    
    
    
  */
    
    
    
    
    
    
    
    PIC.createPad = function (id) {
        
        var pad = {},
            $canvas = $('#' + id),
            $doc = $(document),
            context = $canvas[0].getContext('2d'),
            penX = 0,
            penY = 0,
            isPenDown = false,
            path;
        
        // Path    
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
        
        
        // Context    
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
        
        
        // Return object
        return {
            penDown: function () {
                //path.down();
                path.add('down');
                path.render();
            },
            penUp: function () {
                //path.up()'
                path.add('up');
                path.render();
            },
            moveTo: function (x, y) {
                //path.move(x, y);
                path.add('move', x, y);
                path.render();
            }
        }
    }
        
      
    
}())