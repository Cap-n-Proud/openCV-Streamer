var fs = require('fs');
var ssh2 = require('/usr/local/lib/node_modules/ssh2').Client;

function uploadFile(source, target)
{
//var source = "/home/pi/Documents/log/Baileylog.log";
//var target = "/share/Public/Baileylog.log";
var conn = new ssh2();
 
conn.on(
    'connect',
    function () {
        console.log( "- connected" );
    }
);




conn.on(
    'ready',
    function () {
        console.log( "- ready" );
 
        conn.sftp(
            function (err, sftp) {
                if ( err ) {
                    console.log( "Error, problem starting SFTP: %s", err );
                    process.exit( 2 );
                }
 
                console.log( "- SFTP started" );
 
                // upload file
                var readStream = fs.createReadStream( source );
                var writeStream = sftp.createWriteStream( target );
                  
                //Add here an event to measure the progress of teh stream 
                /*readStream.on(
                    'data',
                    function (data) {
                        
                         console.log(data); 
                    }
                );*/
                
                // what to do when transfer finishes
                writeStream.on(
                    'close',
                    function () {
                        console.log( "- file " + source + " ("+ writeStream.bytesWritten +" bytes) transferred" );
                        sftp.end();
                         //console.log(writeStream.bytesWritten); 
                        process.exit( 0 );
                    }
                );
                
                // initiate transfer of file
                readStream.pipe( writeStream );
            }
        );
    }
);
 
conn.on(
    'error',
    function (err) {
        console.log( "- connection error: %s", err );
        process.exit( 1 );
    }
);
 


conn.on(
    'end',
    function () {
        process.exit( 0 );
    }
);
 
conn.connect(
    {
        "host": "192.168.1.121",
        "port": 22,
        "username": "admin",
        //"password": "DoveAvesse1"//"
        "privateKey": fs.readFileSync('/home/pi/.ssh/id_rsa').toString('utf8')//"/home/pi/.ssh/id_rsa",
        //"passphrase":""
    }
);

}
   // exports ======================================================================
  exports.uploadFile = uploadFile;