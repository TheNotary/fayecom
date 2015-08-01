var port = 8000,
    authTokenEnvName = "SAVE_KITTENS_FAYE_TOKEN",
    mode = "https";

var authToken = process.env[authTokenEnvName];

var http = require('http'),
    https = require('https'),
    fs = require('fs'),
    faye = require('faye');

// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync('test/fixtures/keys/key.pem'),
  cert: fs.readFileSync('test/fixtures/keys/cert.pem')  // was *.cert
};

var server = http.createServer(),
    tlsServer = https.createServer(options),
    bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

// Echo messages the server receives
bayeux.on('publish', function(clientId, channel, data) {
  console.log(xinspect(data));
});

// Ensures only the rails server can publish by using secret token
var serverOnlyWriteAccess = {
  incoming: function(message, callback) {

    // Let non-publishing messages through
    if (message.channel !== '/save_kittens/data/fresh_data')
      return callback(message);

    // Get subscribed channel and auth token
    var subscription = message.subscription,
        msgToken     = message.ext && message.ext.authToken;
    
    // Add an error if the tokens don't match
    if (authToken !== msgToken)
      message.error = 'Invalid publication auth token';

    // Call the server back now we're done
    callback(message);
  }

};

console.log("starting server");

bayeux.addExtension(serverOnlyWriteAccess);
if (mode == "https")
  server = tlsServer;
bayeux.attach(server);
server.listen(port);


function xinspect(o,i){
    if(typeof i=='undefined')i='';
    if(i.length>50)return '[MAX ITERATIONS]';
    var r=[];
    for(var p in o){
        var t=typeof o[p];
        r.push(i+'"'+p+'" ('+t+') => '+(t=='object' ? 'object:'+xinspect(o[p],i+'  ') : o[p]+''));
    }
    return r.join(i+'\n');
}

