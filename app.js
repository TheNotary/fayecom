var http = require('http'),
    faye = require('faye');

var server = http.createServer(),
    bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

console.log("starting server");

bayeux.on('publish', function(clientId) {
  console.log("got something" + clientId);
})

bayeux.attach(server);
server.listen(8000);

