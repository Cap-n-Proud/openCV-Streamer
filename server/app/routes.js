
// Routers
// expose the routes to our app with module.exports
var server = require('./server');
var installPath = "";//server.nconf.get('server:installPath');
module.exports = function(app) {

var path = require('path'); 

    //app.use(express.static(__dirname + '/wwwroot'));
    // Routers
  

//
//app.use(express.static('/home/pi/Bailey/server/wwwroot/'));
// Routers
{
app.get('/', function(req, res){
  res.sendFile(server.nconf.get('server:installPath') + 'server/wwwroot/index.html');
  res.end;
});

app.get('/video', function(req, res) {
  res.sendFile(server.nconf.get('server:installPath') + 'server/wwwroot/video.html');
  res.end;
});

app.get('/test', function(req, res) {
  res.sendFile(server.nconf.get('server:installPath') + 'server/wwwroot/test.html');
  res.end;
});


}

    }
