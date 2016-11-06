var cv = require('opencv');
var ffmpeg = require('fluent-ffmpeg');
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
//https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/360
//http://unix.stackexchange.com/questions/55773/move-tmp-to-ram
//systemctl enable tmp.mount
function startVideoFeed(videoWidth, videoHeight, fps) {

    camera.setWidth(videoWidth);
    camera.setHeight(videoHeight);
    var camInterval = 1000 / fps;
    //var camInterval = fps;

        var im,im2;
        var d = new Date();
        start = d.getTime();

        frame++;
       im = camera.ReadSync();
      
        im.save("/tmp/img.png");
        
// make sure you set the correct path to your video file
var proc = ffmpeg('/tmp/img.png')
  // loop for 5 seconds
  .loop(3)
  // using 25 fps
  .fps(25)
  // setup event handlers
  .on('end', function() {
    console.log('file has been converted succesfully');
  })
  .on('error', function(err) {
    console.log('an error happened: ' + err.message);
  })
  // save to file
  .save('video.m4v');


        
      //  im.release();
        d = new Date();
        fps = 1000 / (d.getTime() - start);




};

 console.log('Starting');
startVideoFeed(640, 480, 25);
 