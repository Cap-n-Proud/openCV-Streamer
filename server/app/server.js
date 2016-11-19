// sudo udevadm control --reload-rules
// to refresh the port allocation
var nconf = require('nconf');
nconf.argv()
    .env()
    .file({
        file: __dirname + '/config.json'
    });

var nodeLib = nconf.get('server:nodeLib');
var logfilePath = nconf.get('server:logfilePath');
var installPath = nconf.get('server:installPath');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var sys = require('util');
var exec = require('child_process').exec;


var serverPort = nconf.get('server:serverPort');
var version = nconf.get('server:version');
var videoFeedPort = nconf.get('video:port');
var videoWidth = nconf.get('video:videoWidth');
var videoHeight = nconf.get('video:videoHeight');
var fps = nconf.get('video:fps');

// include custom functions ======================================================================
//var camera = require(installPath + 'server/app/lib/camera');
var videoFeed = require(installPath + 'server/app/lib/video');


// load the routes
require('./routes')(app);

app.use(express.static(installPath + 'server/wwwroot'));

var serverADDR = 'N/A';



//Get IP address http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js

var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function(ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function(iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }

        if (alias >= 1) {
            // this single interface has multiple ipv4 addresses
            console.log(ifname + ':' + alias, iface.address);
        } else {
            // this interface has only one ipv4 adress
            serverADDR = iface.address;
        }
    });
});
//---------------




io.on('connection', function(socket) {
    //socket.emit('connected', version, Telemetry);

    var myDate = new Date();

    var startMessage = 'Connected ' + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds() + ' v' + version + ' @' + serverADDR;

    socket.emit('connected', startMessage, serverADDR, serverPort, videoFeedPort);
    console.log('New socket.io connection - id: %s', socket.id);

    setTimeout(function() {
        videoFeed.startVideoFeed(socket, videoWidth, videoHeight, fps);
        console.log('Video Feed started');

    }, 500);


    //Server Commands
    socket.on('REBOOT', function() {
        function puts(error, stdout, stderr) {
            sys.puts(stdout)
        }
        exec('sudo reboot now');
        sockets.emit('Info', "Rebooting")
    });

    socket.on('SHUTDOWN', function() {
        socket.emit('Info', "Bailey going down for maintenance now!");

        function puts(error, stdout, stderr) {
            sys.puts(stdout)
        }
        exec('sudo shutdown now');

    });

    socket.on('disconnect', function() {
        console.log('Disconnected id: %s', socket.id);
    });

    socket.on('connected', function() {
        //console.log('CONNECTED id: %s', socket.id);
        // log.info('Client disconnected ' + socket.id);sudo modprobe bcm2835-v4l2
    });
});

io.on('disconnect', function() {
    console.log('A socket with sessionID ' + hs.sessionID +
        ' disconnected!');
});

http.listen(serverPort, function() {
    console.log('listening on *: ' + serverADDR + ':' + serverPort + ' video feed: ' + videoFeedPort);


});

module.exports.nconf = nconf;
