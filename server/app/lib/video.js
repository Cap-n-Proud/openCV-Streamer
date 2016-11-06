var cv = require('opencv');
var server = require('../server');

//var exec = require('child_process').exec;

var frame = 0;
var e = 0;

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
        //heading += 5;

        if (rss > memoryLeakLimit) {
            //console.log('Memory leak detected (' + rss.toFixed(1) + ' Mb) : call GC');
            // if (typeof global.gc === 'function') {
            //   global.gc();
            //}
        }

    }, 0.5 * 1000)



    setInterval(function() {
        var im;
        var d = new Date();
        start = d.getTime();

        frame++;
        im = camera.ReadSync();
        if (server.nconf.get('video:drawCompass')) drawCompass(im, videoWidth, videoHeight, server.Telemetry['yaw']);
        if (server.nconf.get('video:drawCrosshair')) drawCrosshair(im, videoWidth, videoHeight);
        if (server.nconf.get('video:drawOverlayInfo')) drawOverlayInfo(im, videoWidth, videoHeight, rss, fps);

        if (im.size()[0] > 0 && im.size()[1] > 0) {
            socket.emit('frame', {
                buffer: im.toBuffer({
                    ext: ".jpg",
                    jpegQuality: 95
                })
            });



        } else {
            e++
        }
        im.release();
        d = new Date();
        fps = 1000 / (d.getTime() - start);



    }, camInterval);

};

function drawCrosshair(im, videoWidth, videoHeight) {
    var hudColor = JSON.parse(server.nconf.get('video:hudColor'));

    im.line([videoWidth / 2 - 20, videoHeight / 2], [videoWidth / 2 - 40, videoHeight / 2], hudColor);
    im.line([videoWidth / 2 + 20, videoHeight / 2], [videoWidth / 2 + 40, videoHeight / 2], hudColor);
    im.line([videoWidth / 2, videoHeight / 2 - 20], [videoWidth / 2, videoHeight / 2 - 40], hudColor);
    im.line([videoWidth / 2, videoHeight / 2 + 20], [videoWidth / 2, videoHeight / 2 + 40], hudColor);


}

function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function reduce(val, base) {

    return val - parseInt(val / base) * base;
}

function drawCompass(im, videoWidth, videoHeight, heading) {
    var hudColor = JSON.parse(server.nconf.get('video:hudColor'));
    var leftMargin = .2 * videoWidth;
    var rightMargin = .8 * videoWidth;
    // Correct for when signs are reversed.
    var onScreenColor = JSON.parse(server.nconf.get('video:onScreenColor'));
    var fontSize = videoWidth * JSON.parse(server.nconf.get('video:fontBaseSize')) / 320;
    var cardinalDirection = ['N', 'W', 'S', 'E'];

    var start = videoWidth / 2 + heading / 1;
    if (start > 360) start += -360;
    for (i = 0; i < 4; i++) {
        x = start + (i * 90);
        if (x > 359) x += -360;
        im.putText(cardinalDirection[i], x - 4, 25, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, 0.7 * fontSize);
    }

    for (i = 0; i < 360; i += 30) {
        x = start + (i);
        if (x > 359) x += -360;
        im.line([x, -screenMargin], [x, +screenMargin + 10], hudColor);
    };
    for (i = 0; i < 360; i += 10) {
        x = start + (i);
        if (x > 359) x += -360;
        im.line([x, -screenMargin], [x, +screenMargin + 5], hudColor);
    };


    drawHeading(im, videoWidth, videoHeight, heading);
}

function drawHeading(im, videoWidth, videoHeight, heading) {
    var fontSize = videoWidth * JSON.parse(server.nconf.get('video:fontBaseSize')) / 320;
    var hudColor = JSON.parse(server.nconf.get('video:hudColor'));
    var onScreenColor = JSON.parse(server.nconf.get('video:onScreenColor'));


    var lenght = fontSize * 80,
        height = fontSize * 30;


    im.line([videoWidth / 2 - lenght / 2, +45], [videoWidth / 2 + lenght / 2, +45], hudColor);
    im.line([videoWidth / 2 - lenght / 2, +45], [videoWidth / 2 - lenght / 2, +45 - height], hudColor);
    im.line([videoWidth / 2 + lenght / 2, +45], [videoWidth / 2 + lenght / 2, +45 - height], hudColor);
    im.line([videoWidth / 2 - lenght / 2, +45 - height], [videoWidth / 2, +45 - height - 8], hudColor);
    im.line([videoWidth / 2 + lenght / 2, +45 - height], [videoWidth / 2, +45 - height - 8], hudColor);
    im.putText(Math.floor(heading), videoWidth / 2 - lenght / 2 + 2 * screenMargin, 45 - screenMargin, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);


}


function drawOverlayInfo(im, videoWidth, videoHeight, memory, fps) {
    var onScreenColor = JSON.parse(server.nconf.get('video:onScreenColor'));
    var fontSize = videoWidth * JSON.parse(server.nconf.get('video:fontBaseSize')) / 320;
    var lineSpace = 3 * 10 * fontSize;
    var leftCol = 0.01 * videoWidth,
        rightCol = 0.75 * videoWidth;


    im.putText(videoWidth + "x" + videoHeight, leftCol, videoHeight - 0 * lineSpace - screenMargin, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);
    // im.putText("f:" + frame, leftCol, videoHeight - 1 * lineSpace - screenMargin, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);
    im.putText("fps: " + parseInt(fps), leftCol, videoHeight - 1 * lineSpace - screenMargin, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);
    im.putText(videoWidth + "x" + videoHeight, leftCol, videoHeight - 0 * lineSpace - screenMargin, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);
    // im.putText("f:" + frame, leftCol, videoHeight - 1 * lineSpace - screenMargin, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);


    im.putText("y: " + server.Telemetry['yaw'], rightCol, videoHeight - 3 * lineSpace - screenMargin, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);
    im.putText("r: " + server.Telemetry['roll'], rightCol, videoHeight - 2 * lineSpace - screenMargin, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);
    im.putText("p: " + server.Telemetry['pitch'], rightCol, videoHeight - 4 * lineSpace - screenMargin, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);
    im.putText("t: " + server.temperature, rightCol, videoHeight - 1 * lineSpace - screenMargin, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);

    //im.putText("t: " + server.nconf.get('server:version'), 0.8 * videoWidth, 0.3 * videoHeight - 3 * lineSpace, "CV_FONT_HERSHEY_SIMPLEX", server.nconf.get('video:onScreenColor'), 0.5);    

    // im.putText(" x " + videoHeight, 0.01 * videoWidth + 10, 0.9 * videoHeight, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);      

    im.putText("m: " + parseInt(memory), rightCol, videoHeight - 0 * lineSpace - screenMargin, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);
    im.putText("m: " + parseInt(memory), rightCol, videoHeight - 0 * lineSpace - screenMargin, "CV_FONT_HERSHEY_SIMPLEX", onScreenColor, fontSize);




}


exports.startVideoFeed = startVideoFeed;
