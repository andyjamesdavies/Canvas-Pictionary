var PIC = window.PIC || {};

PIC.chat = function (comms) {
	
	return {
		init: function() {
			var classes = ['even', 'odd'],
				numMsgs = 0;
		
			comms.message(function(data){ 
				if ( data['chat']) {
					var msg = data['chat'];
					numMsgs++;
				
					$('#msgs').append(function() {
						var div = $('<div class="'+classes[numMsgs%2]+'"></div>');
		      
						div.text(msg.username + ' says: ' + msg.message);
						return div;
					});
					var objDiv = document.getElementById('msgs');
					objDiv.scrollTop = objDiv.scrollHeight;
				}
			});			
		},
		sendMsg: function() {
		    var values = { };
		    $.each($('#chat').serializeArray(), function(i, v){
		        values[v.name] = v.value;
		    });
		    
		    document.getElementById("msg").value = "";
		    comms.send(values, 'chat');
		}
	}
}

//var socket = new io.Socket('localhost', {port: 8081});
//    
//socket.connect();
//
//var classes = ['even', 'odd'],
//    numMsgs = 0;
//
//socket.on('message',function(data){ 
//   var msg = JSON.parse(data);
//   numMsgs++;
//   $('#msgs').append(function() {
//      var div = $('<div class="'+classes[numMsgs%2]+'"></div>');
//      
//      div.text(msg.username + ' says: ' + msg.message);
//      return div;
//   });
//   var objDiv = document.getElementById('msgs');
//   objDiv.scrollTop = objDiv.scrollHeight;
//});
//
//var sendMsg = function() {
//    var values = { };
//    $.each($('#chat').serializeArray(), function(i, v){
//        values[v.name] = v.value;
//    });
//    document.getElementById("msg").value = "";
//    socket.send(JSON.stringify(values));
//}