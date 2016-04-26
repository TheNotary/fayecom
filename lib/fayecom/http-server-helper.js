var appRoot = require('path').resolve(__dirname + "/../.."),
    IsThere = require("is-there"),
    url=require('url'),
    pjson = require(appRoot + '/package.json'),
    fs = require('fs');


// Loads the ssl key into an options hash.  If the key isn't there will termin8
module.exports.loadSslKey = function() {
  // Check if we can boot this thing 'securely'
  if (!IsThere(appRoot  + '/test/fixtures/keys/key.pem')){
    console.log("FATAL:  Could not find the .pem key!");
    console.log("Not in " + appRoot);
    process.exit(1);
  }

  var tlsOptions = {
    key: fs.readFileSync(appRoot + '/test/fixtures/keys/key.pem'),
    cert: fs.readFileSync(appRoot + '/test/fixtures/keys/cert.pem')
  };

  return tlsOptions;
};

module.exports.serverLogic = function(request, response) {
  var pathname = url.parse(request.url, true).pathname;
  if (pathname == "/version") response.end(pjson.version);
};
