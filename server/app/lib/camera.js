   
   function snapShotTL(imgWidth, imgHeight, folderName, fileName) {

       function puts(error, stdout, stderr) {
           sys.puts(stdout)
       }
       exec('sudo raspistill -w ' + imgWidth + ' -h ' + imgHeight + ' -o ' + folderName + '/' + fileName + '.jpg  -sh 40 -awb auto -mm average -v');
       socket.emit('Info', fileName + '.jpg');
       socket.emit('Folder', folderName);

   }

   function snapShot(imgWidth, imgHeight, SNFolder, fileName, serverADDR, MJPGPort) {

       function puts(error, stdout, stderr) {
           sys.puts(stdout)
       }
       exec('sudo wget -O ' + SNFolder + fileName + '.jpg http://' + serverADDR + ':' + MJPGPort + '/?action=snapshot');
   }


   function startTL(imgWidth, imgHeight, TLInterval, TLFolder, timeStamp) {
       TLfolderName = TLFolder + 'TL_' + timeStamp;
       TLfileName = 'TL_' + timeStamp;
       fs.mkdir(TLfolderName);
       socket.emit('Folder', TLfolderName);
       //console.log(TLfolderName);
       //log.info('Time-Lapse started ' + TLFolder + 'TL_' + timeStamp);

       myVar = setInterval(function() {
           snapShotTL(imgWidth, imgHeight, TLfolderName, TLfileName)
       }, TLInterval);

   }
   
   // exports ======================================================================
  //exports.snapShotTL = snapShotTL;
  exports.snapShot = snapShot;
  exports.startTL = startTL;
     
