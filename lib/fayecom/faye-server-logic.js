// faye-server-logic.js
var appRoot = require('path').resolve(__dirname + "/../.."),
    xinspect = require(appRoot + '/lib/fayecom/xinspector');

// Echo messages the server receives
module.exports.printMessageContentsOnPublication = function(clientId, channel, data) {
  console.log(xinspect(data));
};

// Ensures only the rails server can publish by using secret token
module.exports.serverOnlyWriteAccess = {
  incoming: function(message, callback) {
    if (process.env.debug == "true") {
      console.log("Had something incoming...");
      console.log(xinspect(message));
    }

    // Let non-publishing messages through
    if (message.channel !== '/save_kittens/data/fresh_data') {
      if (process.env.debug == "true")
        console.log("The message was to a channel other than /save_kittens/data/fresh_data");

      return callback(message);
    }

    // TODO: fire an event here and refactor the code to handleDataSentToMessageChannel

    // Get subscribed channel and auth token
    var subscription = message.subscription,
        msgToken     = message.ext && message.ext.authToken;

    // Add an error if the tokens don't match
    if (process.env.auth_token !== msgToken){
      if (process.env.debug == "true") {
        console.log("recieved invalid publication auth token");
        console.log("Faye is set to: " + process.env.auth_token);
        console.log("A client sent: " + msgToken);
      }

      message.error = 'Invalid publication auth token';
    }

    // Call the server back now we're done
    callback(message);
  }

};
