var PIC = window.PIC || {};


PIC.comms = function (url) {

    var socket = io.connect(url); 
        
    return {
        start: function () {
//            socket.connect();
            return this;
        },
        stop: function () {
            socket.disconnect();
            return this;
        },
        send: function (data, messageType) {
        	var sendData = {};

        	if (messageType) {
        		sendData[messageType] = data;
        	} else {
        		sendData = data;
        	}

            socket.json.send(sendData)
            return this;
        },
        connect: function (callback) {
            socket.on('connect', callback)
            return this;
        },
        message: function (callback) {
            socket.on('message', callback)
            return this;
        },
        disconnect: function (callback) {
            socket.on('disconnect', callback);
            return this;
        }
    };
};