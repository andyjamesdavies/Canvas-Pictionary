(function () {
		
	var pad = PIC.createPad('myCanvas'),
		comms = PIC.comms('127.0.0.1').start(); 
	
	comms.connect(function () {
		comms.send('Hello server!')
	})
	comms.message(function (data) {
		console.log('Just in from the server:', data);
	})
	
}())