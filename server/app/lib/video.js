var cv = require('opencv');
var server = require('../server');

//var exec = require('child_process').exec;

var frame = 0;
var e = 0;
var heading = 0;

// initialize camera
/*
  function puts(error, stdout, stderr) { sys.puts(stdout) }
    exec('sudo modprobe bcm2835-v4l2', puts);
*/
var screenMargin = 3;

var camera = new cv.VideoCapture(0);

function startVideoFeed(socket, videoWidth, videoHeight, fps) {

    camera.setWidth(videoWidth);
    camera.setHeight(videoHeight);
    var camInterval = 1000 / fps;



    var memory, rss, memoryLeakLimit;


    setInterval(function() {

        memory = process.memoryUsage();
        rss = memory.rss / 1024 / 1024;
        memoryLeakLimit = 100;
        heading += 3;

        if (rss > memoryLeakLimit) {
            //console.log('Memory leak detected (' + rss.toFixed(1) + ' Mb) : call GC');
            // if (typeof global.gc === 'function') {
            //   global.gc();
            //}
        }

    }, 1 * 1000)



    setInterval(function() {
        var im;
        //camera.read(function(err, im)
        //{
        //	if (err) throw err;
        frame++;
        im = camera.ReadSync();
        if (server.nconf.get('video:drawCompass'))drawCompass(im, videoWidth, videoHeight, heading);
        if (server.nconf.get('video:drawCrosshair'))drawCrosshair(im, videoWidth, videoHeight);
        if (server.nconf.get('video:drawOverlayInfo'))drawOverlayInfo(im, videoWidth, videoHeight, rss);

        if (im.size()[0] > 0 && im.size()[1] > 0) {
            socket.emit('frame', {
                buffer: im.toBuffer({
                    ext: ".jpg",
                    jpegQuality: 80
                })
            });



        } else {
            e++
        }
        im.release();

        //}); 



    }, camInterval);

};

function drawCrosshair(im, videoWidth, videoHeight) {
    var hudColor = JSON.parse(server.nconf.get('video:hudColor'));

    im.line([videoWidth / 2 - 20, videoHeight / 2], [videoWidth / 2 - 40, videoHeight / 2], hudColor);
    im.line([videoWidth / 2 + 20, videoHeight / 2], [videoWidth / 2 + 40, videoHeight / 2], hudColor);
    im.line([videoWidth / 2, videoHeight / 2 - 20], [videoWidth / 2, videoHeight / 2 - 40], hudColor);
    im.line([videoWidth / 2, videoHeight / 2 + 20], [videoWidth / 2, videoHeight / 2 + 40], hudColor);


}

function drawCompass(im, videoWidth, videoHeight, heading) {
    var hudColor = JSON.parse(server.nconf.get('video:hudColor'));
    var minI = videoWidth / 5,
        maxI = (4 / 5) * videoWidth;
    var onScreenColor = JSON.parse(server.nconf.get('video:onScreenColor'));
    var fontSize = videoWidth * JSON.parse(server.nconf.get('video:fontBaseSize')) / 320;
    var compassRange = maxI - minI;
    im.putText(heading, 25, 15, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);
    //im.putText(minI, 25 , 35, "CV_FONT_HERSHEY_SIMPLEX",  onScreenColor, fontSize);
    //im.putText(maxI, 25 , 55, "CV_FONT_HERSHEY_SIMPLEX",  onScreenColor, fontSize);
    //im.putText(parseInt(heading / compassRange), 25 , 85, "CV_FONT_HERSHEY_SIMPLEX",  onScreenColor, fontSize);

    //heading = heading / (maxI - minI);
    //if (heading > compassRange)heading = heading - compassRange;
    //compensation = heading - compassrange/2
    /*for (i = 0; i < maxI; i+=10) {
        if (i+heading < maxI && i+heading > minI){
        im.line([i + heading, - screenMargin], [i + heading, + screenMargin + 10], hudColor);
        
        if ((0 + heading +0.5*videoWidth< maxI && 0+heading +0.5*videoWidth> minI))
        im.putText("N", 0 + heading +0.5*videoWidth, 25, "CV_FONT_HERSHEY_SIMPLEX",  onScreenColor, 0.7*fontSize);
        if ((90 + heading +0.5*videoWidth< maxI && 90+heading +0.5*videoWidth> minI))
        im.putText("E", 90 + heading +0.5*videoWidth, 25, "CV_FONT_HERSHEY_SIMPLEX",  onScreenColor, 0.7*fontSize);
        
        
        if ((-90 + heading +0.5*videoWidth< maxI && 270 + heading +0.5*videoWidth> minI))
        im.putText("W", 90 + heading +0.5*videoWidth, 25, "CV_FONT_HERSHEY_SIMPLEX",  onScreenColor, 0.7*fontSize);

        if ((180 + heading +0.5*videoWidth< maxI && 180 + heading +0.5*videoWidth> minI))
        im.putText("S", 0 + heading +0.5*videoWidth, 25, "CV_FONT_HERSHEY_SIMPLEX",  onScreenColor, 0.7*fontSize);
            
        }               
    }*/

}

function drawOverlayInfo(im, videoWidth, videoHeight, memory) {
    var onScreenColor = JSON.parse(server.nconf.get('video:onScreenColor'));
    var fontSize = videoWidth * JSON.parse(server.nconf.get('video:fontBaseSize')) / 320;
    var lineSpace = 3 * 10 * fontSize;
    var leftCol = 0.01 * videoWidth,
        rightCol = 0.75 * videoWidth;


    im.putText(videoWidth + "x" + videoHeight, leftCol, videoHeight - 0 * lineSpace - screenMargin, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);
    im.putText("f:" + frame, leftCol, videoHeight - 1 * lineSpace - screenMargin, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);
    /*im.putText("y: " + server.Telemetry['yaw'], 0.7 * videoWidth, 0.3 * videoHeight - 1 * lineSpace, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);    
                                im.putText("r: " + server.Telemetry['roll'], 0.7 * videoWidth, 0.3 * videoHeight - 2 * lineSpace, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);    
                                im.putText("t: " + server.temperature, 0.7 * videoWidth, 0.3 * videoHeight - 3 * lineSpace, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);    
                                */
    //im.putText("t: " + server.nconf.get('server:version'), 0.8 * videoWidth, 0.3 * videoHeight - 3 * lineSpace, "CV_FONT_HERSHEY_SIMPLEX", server.nconf.get('video:onScreenColor'), 0.5);    

    // im.putText(" x " + videoHeight, 0.01 * videoWidth + 10, 0.9 * videoHeight, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);      

    im.putText("m: " + parseInt(memory), rightCol, videoHeight - 0 * lineSpace - screenMargin, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);




}


exports.startVideoFeed = startVideoFeed;