var PIC = window.PIC || {};


PIC.createPad = function (selector) {
    
    var pen, pad, callbacks;
    
    callbacks = [];
    
    pen = (function () {
        
        var $canvas, $doc, context, history, padX, padY, isDown, step;
        
        $canvas = $(selector).first();
        $doc = $(document);
        history = [];
        padX = $canvas.offset().left;
        padY = $canvas.offset().top;
        isDown = false;
        context = $canvas[0].getContext('2d');
        step = function (actionName) {
            return function (x, y) {
                var newStep = {}, i;
                
                newStep.action = actionName;
                if (x && y) {
                    newStep.x = x;
                    newStep.y = y;
                }
                history.push(newStep);
                pen.draw();
                
                                
                for (i = 0; i < callbacks.length; i++) {
                    callbacks[i](newStep);  
                }
            };
        };
        
        // Setup
        context.lineWidth = 4;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        
        // Events
        $canvas.mousedown(function (e) {
            pen.down();
            pen.move(e.pageX - padX, e.pageY - padY - 0.001);
            pen.move(e.pageX - padX, e.pageY - padY);
            
            $doc.bind('mousemove', function (e) {
                pen.move(e.pageX - padX, e.pageY - padY);
            });
        });
        $doc.mouseup(function (e) {
            pen.up();
            $doc.unbind('mousemove');
        });
        
        return {
            up: step('up'),
            down: step('down'),
            move: step('move'),
            clear: function () {
                context.clearRect(0, 0, 10000, 10000); 
            },
            draw: function () {
                var i, step, x, y;
                isDown = false;
                pen.clear();
                
                for (i = 0; i < history.length; i++) {
                    step = history[i];
                    switch (step.action) {
                        case 'down':
                            context.beginPath();
                            isDown = true;
                            break;
                        case 'move':
                            context[isDown ? 'lineTo' : 'moveTo'](step.x, step.y);
                            break;
                        case 'up':
                            context.stroke();
                            isDown = false;
                            break;
                    }
                }
                if (isDown) {
                    context.stroke();
                }
            },
            history: function (newHistory) {
                if (newHistory) {
                    history = newHistory
                }
                return history;
            }
        };    
    }());
    
    
    pad = (function () {
        
        return {
            history: function () {
                
            },
            step: function (step) {
                pen.history(pen.history().concat([step]));
                pen.draw();
            },
            clear: function () {
                
            },
            onStep: function (callback) {
                callbacks.push(callback);
            },
            reset: function () {
                pen.clear();
                pen.history([]);
            }
        };
    }());

    return pad;
};