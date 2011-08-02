var PIC = window.PIC || {};


PIC.comms = function (url) {

    var socket = io.connect(url); 

    return {
        start: function () {
        	//v0.7.x of socket.io means this is not needed as it is done in the initialisation
            //socket.connect();
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
        },
        get_uid: function() {
        	return socket.socket.sessionid;
        }
    };
};