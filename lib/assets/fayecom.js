(function() {
/*
  ###################
  #     Fayecom     #
  ###################

  A js library that makes working with websockets made available by
  FayeCom an absolute snap!

  This is handy for situations where you want you want a browser client
  to subscribe to a websocket channel (no subscription authentication)
  and you feed messages to said channel by some other means (authenticated).


  *****************
  *     Usage     *
  *****************

  Instatiate a fayecom object passing in an options hash, i.e.

  `f = new Fayecom({fayecom_address: a, fayecom_protocol: b, fayecom_port: c})`

  Then you might try subscribing to a channel and instructing the browser to do
  something cool when a message comes in. i.e.

  `f.subscriptions.add('/chan1', function() { alert('Something Cool!'); })`


  *****************
  *     Debug     *
  *****************

  Once you have a fayecom object, it will automatically attempt a handshake with
  the fayecom server.  Check fayecom server logs to verify connection.  Also
  try `fayecome.fayeClient.connection`, 3 means good, other numbers mean not
  good.


  parameters:
    options:
      fayecom_address - the domain/ ip of the fayecom server
      fayecom_protocol - either 'http' or 'https', w/e the fayecom server wants
      fayecomPort - The port that the fayecom server is listening on

  This code should be moved to fayecome so I don't have to maintain
  it per rails app that I deploy it against...
*/
function Fayecom(options) {
  this.fayeClient = null;
  var self = this;

  var fayecom_address = options["fayecom_address"];
  var protocol = options["fayecom_protocol"];
  var port = options["fayecom_port"];

  attemptConnectionWithFayeServer();

  function attemptConnectionWithFayeServer() {
    console.log("about to try a connection to fayecom at " + url());

    self.fayeClient = new Faye.Client(url()).on('transport:up', function() {
      console.log("transport up");
      self.fayeClient.online = true;
    }).on('transport:down', function() {
      console.log("transport down");
      self.fayeClient.online = false;
    });

    self.fayeClient.connect();
  }

  // builds url to faye server, eg 'http://localhost:8000/faye'
  function url() {
    return protocol + "://" + fayecom_address + ":" + port + "/faye";
  }

  /*
    ********************
    #  Subscritptions  #
    ********************

    This object is where things related to subscribed to channels go.
  */
  this.subscriptions = {
    clearAll: function() {
      throw "not implemented";
    },

    /*
      ***********************
      *  subscriptions#add  *
      ***********************

      This will subscribe the client to a new channel.

        parameters:
          channel:
            A string that is the name of the channel to
            subscribe to.
          messageProcessingCallback:
            A callback function that will execute when a message
            hits the channel being subscribed to.  The cb will
            recieve 1 parameter, a string representing a JSON hash.
    */
    add: function(channel, messageProcessingCallback) {

      if ( !self.subscriptions.doesSubscriptionAlreadyExist(channel) ){
        console.log("Subscribing to channel: " + channel);
        var subscription = self.fayeClient.subscribe(channel, function(message) {
          // message: "{\"signatureCount\":54,\"topThreeStates\":[\"CA\"]}"
          messageProcessingCallback(message)
        });

        self.subscriptions.collection.push(subscription);
        return subscription;
      }
      else {
        console.log("skipping add to channel since already subscribed to " + channel);
      }
    },

    /*
      ********************************
      * doesSubscriptionAlreadyExist *
      ********************************
      Returns true or false depending if the channel has already been subscribed
      to.

      parameters:
        channel: A string identifieing the channel being tested.
    */
    doesSubscriptionAlreadyExist: function(channel) {
      collection = self.subscriptions.collection;
      for (var i in collection){
        if (collection[i]._channels == channel){
          return true;
        }
      }
      return false;
    },
    collection: []
  }

}

window.Fayecom = Fayecom;
})();
