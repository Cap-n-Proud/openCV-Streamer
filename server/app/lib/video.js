var cv = require('opencv');
var server = require('../server');
//var exec = require('child_process').exec;

var frame =0;
var e = 0;
var lineSpace=15;

// face detection properties
var rectColor = [0, 255, 0];
var rectThickness = 2;

// initialize camera
/*
  function puts(error, stdout, stderr) { sys.puts(stdout) }
    exec('sudo modprobe bcm2835-v4l2', puts);
*/
var camera = new cv.VideoCapture(0);
function startVideoFeed(socket, videoWidth, videoHeight, fps) {


    camera.setWidth(videoWidth);
	camera.setHeight(videoHeight);
	var camInterval = 1000 / fps;

		setInterval(function() {
			camera.read(function(err, im) {
				if (err) throw err;
      frame++;
			

                             
                                
                                
                                if (server.nconf.get('video:crosshair'))drawCrossHair(im);
                          	if (server.nconf.get('video:overlayInfo'))overlayInfo(im, videoWidth, videoHeight);
                          	
                                if (im.size()[0] > 0 && im.size()[1] > 0) {
					socket.emit('frame', {
						buffer: im.toBuffer({
							ext: ".jpg",
							jpegQuality: 80
						})
					});
                                        im="";
				} 
				else 
                                {
					e++
				}
			});

		}, camInterval);

};

function drawCrossHair(im, videoWidth, videoHeight)
        {
                im.line([videoWidth / 2 - 20, videoHeight / 2], [videoWidth / 2 - 40, videoHeight / 2])
                im.line([videoWidth / 2 + 20, videoHeight / 2], [videoWidth / 2 + 40, videoHeight / 2])
                im.line([videoWidth / 2, videoHeight / 2 - 20], [videoWidth / 2, videoHeight / 2- 40])
                im.line([videoWidth / 2, videoHeight / 2 + 20], [videoWidth / 2, videoHeight / 2 + 40])


        }

function overlayInfo(im, videoWidth, videoHeight)
{
    var onScreenColor=  JSON.parse(server.nconf.get('video:onScreenColor'));
    var fontSize = videoWidth*JSON.parse(server.nconf.get('video:fontBaseSize'))/320;

  				im.putText("f:" + frame, 0.01 * videoWidth , 0.3 * videoHeight, "CV_FONT_HERSHEY_SIMPLEX",  onScreenColor, fontSize);
				im.putText("e: " + e, 0.01 * videoWidth, 0.3 * videoHeight - 1 * lineSpace, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);
				
                                /*im.putText("p: " + server.Telemetry['pitch'], 0.7 * videoWidth, 0.3 * videoHeight, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);    
                                im.putText("y: " + server.Telemetry['yaw'], 0.7 * videoWidth, 0.3 * videoHeight - 1 * lineSpace, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);    
                                im.putText("r: " + server.Telemetry['roll'], 0.7 * videoWidth, 0.3 * videoHeight - 2 * lineSpace, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);    
                                im.putText("t: " + server.temperature, 0.7 * videoWidth, 0.3 * videoHeight - 3 * lineSpace, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);    
                                */
                                //im.putText("t: " + server.nconf.get('server:version'), 0.8 * videoWidth, 0.3 * videoHeight - 3 * lineSpace, "CV_FONT_HERSHEY_SIMPLEX", server.nconf.get('video:onScreenColor'), 0.5);    
                             
                                im.putText(videoWidth + " x " + videoHeight, 0.01 * videoWidth, 0.9 * videoHeight, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);    
                               // im.putText(" x " + videoHeight, 0.01 * videoWidth + 10, 0.9 * videoHeight, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);      
}
        

exports.startVideoFeed = startVideoFeed;