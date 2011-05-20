var PIC = window.PIC || {};


PIC.comms = function (url) {

    var socket = new io.Socket(url); 
        
    return {
        start: function () {
            socket.connect();
            return this;
        },
        stop: function () {
            socket.disconnect();
            return this;
        },
        send: function (data, callback) {
            socket.send(data)
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