// sudo udevadm control --reload-rules
// to refresh the port allocation

var nconf = require('nconf');
nconf.argv()
       .env()
       .file({ file: __dirname + '/config.json' });

var events = require('events');
var eventEmitter = new events.EventEmitter();
var nodeLib = nconf.get('server:nodeLib');
var logfilePath = nconf.get('server:logfilePath');

var telemetryfilePath = nconf.get('telemetry:telemetryfilePath');
var bunyan = require('bunyan');

//--------------- Logging middleware ---------------
var log = bunyan.createLogger({
  name: 'bot',
  streams: [
    /*{
      level: 'debug',
      stream: process.stdout            // log INFO and above to stdout
    },*/
    //Log should be outside app folders
    {
      path: logfilePath + 'bot-Pilog.log'  // log ERROR and above to a file
    }
  ]
});

var fs = require('safefs');
var SEPARATOR = nconf.get('telemetry:SEPARATOR');
var installPath = nconf.get('server:installPath');
var com = require('serialport');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sys = require('sys');
var exec = require('child_process').exec;


var serPort = nconf.get('server:serPort');
var serBaud = nconf.get('server:serBaud');
var serverPort = nconf.get('server:serverPort');
var version = nconf.get('server:version');
var videoFeedPort = nconf.get('video:port');
var videoWidth = nconf.get('video:videoWidth');
var videoHeight = nconf.get('video:videoHeight');
var fps= nconf.get('video:fps');

// include custom functions ======================================================================
var systemModules = require(installPath + 'server/app/lib/systemModules');
var functions = require(installPath + 'server/app/lib/functions');
var camera = require(installPath + 'server/app/lib/camera');
var videoFeed = require(installPath + 'server/app/lib/video');


//var robot = require(installPath + 'server/app/robot');

// load the routes
require('./routes')(app);

app.use(express.static(installPath + 'server/wwwroot'));

var serverADDR = 'N/A';
var LogR = 0;
var TelemetryFN = 'N/A';
var prevTel="";
var prevPitch="";
var THReceived=0;

var TelemetryHeader = 'N/A';
var PIDHeader ='N/A';
var ArduSysHeader;
var Telemetry ={};
var PID ={};
var PIDVal;
var ArduSys = {};
var temperature;




//Get IP address http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js

var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0
    ;

  ifaces[ifname].forEach(function (iface) {
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


    
  
    
io.on('connection', function(socket){
  //socket.emit('connected', version, Telemetry);  
   
    var myDate = new Date();
   
   var startMessage = 'Connected ' + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds()+ ' v' + version + ' @' + serverADDR;
  //Init the heades for telemtry data
   serialPort.write('READ RemoteInit\n\r');

    //socket.emit('serverADDR', serverADDR);
    socket.emit('connected', startMessage, serverADDR, serverPort, videoFeedPort, PID);
    console.log('New socket.io connection - id: %s', socket.id);
    
    //Add also the disconnection event
    log.info('Client connected ' + socket.id, startMessage, serverADDR, serverPort, videoFeedPort, PID + ' video: ' + videoWidth, videoHeight, fps);
    
    setTimeout(function() {
        videoFeed.startVideoFeed(socket, videoWidth, videoHeight, fps); 
    }, 2000);
     

  /* Not needed as the info is displayed on screen
   setInterval(function(){
  if(THReceived==1)socket.emit('status', Telemetry['yaw'], Telemetry['pitch'], Telemetry['roll'], Telemetry['bal'], Telemetry['dISTE']);
  if(Telemetry['pitch'] > 60)log.error('BALANCING FAIL! Pitch: ' + Telemetry['pitch']); 
              //console.log(Telemetry['pitch']);
  }, 250);
*/
  
  setInterval(function(){

  var usage = "N/A";
  temperature = fs.readFileSync("/sys/class/thermal/thermal_zone0/temp");
  temperature = ((temperature/1000).toPrecision(3)) + "°C";

  socket.emit("CPUInfo", temperature, usage);
  }, 3 * 1000);
 
  socket.on('Video', function(Video){
   socket.emit('CMD', Video);
    function puts(error, stdout, stderr) { sys.puts(stdout) }
    exec('sudo bash ' + installPath + 'server/app/bin/' + Video, puts);
        
    });


  //Server Commands

  socket.on('REBOOT', function(){
    function puts(error, stdout, stderr) { sys.puts(stdout) }
    log.info('Server rebootiing now');
    exec('sudo reboot now');
    sockets.emit('Info', "Rebooting")

  });

  socket.on('SHUTDOWN', function(){
    socket.emit('Info', "Bailey going down for maintenance now!");
    log.info('Bailey going down for maintenance now!');
    function puts(error, stdout, stderr) { sys.puts(stdout) }
    exec('sudo shutdown now');
    
  });
  
  socket.on('disconnect', function(){
    console.log('Disconnected id: %s', socket.id);
    log.info('Client disconnected ' + socket.id);
  }); 
  
  socket.on('connected', function(){
    //console.log('CONNECTED id: %s', socket.id);
   // log.info('Client disconnected ' + socket.id);sudo modprobe bcm2835-v4l2
  });   
  
  

 
});

io.on('disconnect', function () {
        console.log('A socket with sessionID ' + hs.sessionID 
            + ' disconnected!');
	log.info('A socket with sessionID ' + hs.sessionID 
            + ' disconnected!');
    });

http.listen(serverPort, function(){
console.log('listening on *: ' + serverADDR + ':' + serverPort + ' video feed: ' + videoFeedPort);
log.info('Server listening on ' + serverADDR + ':' + serverPort + ' video feed: ' + videoFeedPort);
 
 
});


module.exports.Telemetry = Telemetry;
module.exports.temperature = temperature;
module.exports.nconf = nconf;
    
  
