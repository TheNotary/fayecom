## FayeCom
This is a nodejs app that allows for passing messages to clients using efficient websockets on an as-needed basis.  

## Install

# Install nodejs (compile from source)

# Install npm (compile from source)

# Install fayecom and its dependencies globally
    $  npm install -g

## Configuration

Configuration values are just at the top of app.js.
You can specify the port to run on, the name of the environment variable that contains the authentication token, ...

You'll want to create some ssl keys, this explains the procedure:  http://stackoverflow.com/questions/12871565/how-to-create-pem-files-for-https-web-server
    $  cd test/fixtures/keys
    $  openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
    $  openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

The development keys are locked into this repo, and went public, so remake teh keys in production.  


### server only publishing
This app is designed to allow only the server to publish messages to the subscribers.  
This rule is enforced with a secret authentication token named 

## Usage

Start the app.  

    `$  fayecom`

Browser clients can now connect.  
This system is designed to interact with MANY browser clients, and usually ~1 ruby server client (which signals to all the clients).  
Requests to /version will be restponded to with the version of fayecom.  


The best way to start it is with forever.  Just plop in some code to boot forever on @reboot in `crontab`
    
    $  /usr/local/bin/forever start /usr/local/bin/fayecom



    


## Testing

Boot the app from the dev dir by `$  lib/fayecom.js`

The below snippet was super helpful for testing if the server was online.

    // Browser test Client Snippet, logs 3 if successful connection
    var channel = "/save_kittens/data/fresh_data";
    var url = location.protocol + "//" + document.domain + ":8000/faye"; 
    var fayeClient = new Faye.Client(url);
    var subscription = fayeClient.subscribe(channel, function(message) {
      // message: {"signatureCount":54,"topThreeStates":["CA"]}
      alert(message);
    });

    setTimeout(function(){
      console.log(fayeClient._state);
    }, 500);



## Node Cliffnotes for Rails Hackers

  - nodejs is unique in that it is based around the concept of non-blocking code, not just that it's js for server side
    > a node app runs as a signle process, a single thread, node has no concept of threads
    > Node apps are parsed, and all your code does is register events.  
    > after your app evaluates, your app enters it's event loop where events are handled accordingly as they come into the event que (single thread)
    >>> That's how a single threaded node app can listen on multiple ports, those listen calls are non-blocking, they register events

  - package.json lists dependencies, project metadata, the 'entrypoint' or main js file, and project version

  - node_modules/ is where dependencies are installed to when you type `npm install`, don't version track it

  - To debug on breakpoints, start with the parameter debug, `node debug app.js`
    > `cont` will continue to the next `debugger;` statement in your code
    > `repl` will allow you to interact with the environment at your current position

  :: Oragnization of Code ::
    - Modules - 
      > require("yourfile.js") will return a module composed of methods.
        You assign methods to a module via `exports.myMethod= function(){return "hello module"}`
        var o = require("yourfile.js").myMethod();
        // => "hello module"
        ref: http://kevgriffin.com/node-js-using-require-to-load-your-own-files/

  - Misc dev hints
    - https://www.airpair.com/node.js/posts/top-10-mistakes-node-developers-make


  - Using sysvinit (default debian)
    > https://www.npmjs.com/package/initd-forever
  - Using upstart (default ubuntu/ linux mint)
    > https://www.npmjs.com/package/upstarter
  - Using forever (cli)
    > http://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever/




