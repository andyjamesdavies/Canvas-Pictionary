(function () {
	
	
	var pad = PIC.createPad('myCanvas');
	comms = PIC.comms('127.0.0.1').start(); 
	
	comms
		.connect(function () {
				comms.send('Hello mate!!!')
			})
		.message(function (data) {
				console.log('Just in from the server:', data);
				if (data.moves) {
					// only receptor sketchpads should be drawing....
					// need to send instructions one at a time (or clumped), not
					// as an array of all moves, this is perceivably too slow. 
					
					sketchpad.draw(data.moves)
				}
			})
	
	
	console.log(comms);
	
}())