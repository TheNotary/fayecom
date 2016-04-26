// Dependencies
var https = require('https'),
    http = require('http'),
    events = require('events'),
    eventEmitter = new events.EventEmitter(),
    faye = require('faye'),
    appRoot = require('path').resolve(__dirname + "/.."),
    pjson = require(appRoot + '/package.json'),
    httpHelper = require(appRoot + '/lib/fayecom/http-server-helper'),
    fayeHelper = require(appRoot + '/lib/fayecom/faye-server-logic'),
    xinspect = require(appRoot + '/lib/fayecom/xinspector');

// Not implemented yet, but this can be loaded into env.json... later
var channels = "/save_kittens/data/fresh_data".split(" ");


// Load env variables and set up configuration 'globals'
var config = require(appRoot + '/lib/fayecom/config.js'),
    port = parseInt(process.env.PORT),
    ssl_port = parseInt(process.env.DOKKU_NGINX_SSL_PORT);



// Prep the http, https, and bayeux servers
var httpsServer = https.createServer(httpHelper.loadSslKey(), httpHelper.serverLogic),
    httpServer = http.createServer(httpHelper.serverLogic);


// Configure the faye server
var bayeux = new faye.NodeAdapter({ mount: '/faye', timeout: 45 });
bayeux.on('publish', fayeHelper.printMessageContentsOnPublication);
bayeux.addExtension(fayeHelper.serverOnlyWriteAccess);


// Boot up the servers
console.log("FayeCom " + pjson.version + "\nstarting server on port " + port + ", " + ssl_port);
bayeux.attach(httpServer);
httpServer.listen(port);

bayeux.attach(httpsServer);
httpsServer.listen(ssl_port);
