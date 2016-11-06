
var cv = require('opencv');
var i = 0;

var http2 = require('http');
var MJPEG = require('/home/pi/bot-Pi/server/app/MJPEG');
//var fs = require('fs');
//var mjpegServer = require('./mjpeg-server');
var events = require('events');
var eventEmitter = new events.EventEmitter();

http2.createServer(function(req, res) {
    
   MJPEG.setVideoFeed(req, res); 
  
}).listen(9999);
