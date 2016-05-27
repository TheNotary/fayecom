## FayeCom
This is a nodejs app that allows for passing messages to clients using efficient websockets on an as-needed basis.  


## Install and Run Locally

- Install nodejs (compile from source)

- Install npm (compile from source)

- Install fayecom and its dependencies globally

```
$  npm install -g
```

- Boot it from source

```
$  npm start
```

- Or boot it from the global install

```
$  fayecom
FayeCom 0.x.x
starting server
```


# Boot with Docker if you don't want to deal with the above crap

```
$  docker build -t john/fayecom .
$  docker run -p 8000:8000 -p 4430:4430 john/fayecom
```


## Server Configuration

Some configuration values are at the top of app.js, but check in env.json first, it's got all the easy stuff.  

You'll want to create some ssl keys, this explains the procedure:  http://stackoverflow.com/questions/12871565/how-to-create-pem-files-for-https-web-server

```
$  cd test/fixtures/keys
$  openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
$  openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

The development keys are locked into this repo, and went public, so remake the keys for production use.  


## Client Configuration

It's easy to get a web browser client setup.  A sample config might be:

```
<script type="text/javascript" src="http://fayecom.example.com:8000/fayecom.js"></script>

<script>
  var fayecom = new Fayecom({
    fayecom_address: 'example.com',
    fayecom_protocol: 'http',
    fayecom_port: '8000'})

  fayecom.subscriptions.add("/channel", function(message) {
    alert('got a message: ' + message);
  });
</script>
```


### Server Only Publishing
This app is designed to allow only the server to publish messages to the subscribers.  This rule is enforced with a secret authentication token specified on the server in charge of publishing.  


## Usage

Once you've got the app running, clients will be able to connect (perhaps via save_kittens in a browser).  This system is designed to interact with MANY subscribing browser clients, and usually ~1 publishing 'client'.  Requests to /version will be responded to with the version of fayecom.  Requests to `/fayecom.js` we be responded to with a helper library for making channel subscription that much simpler.  


### Deploy as Service

#### Forever

One way to start the fayecom as a production service is with forever.  Just plop in some code to boot forever on @reboot in `crontab`
```
$  /usr/local/bin/forever start /usr/local/bin/fayecom
```


#### Push to Dokku

This repo can actually be pushed directly to Heroku/ Dokku because it has been dockerized (read the Dockerfile to get a better understanding of this).  Just be sure to send over the configuration values in env.json as actual ENV vars on the push-to-deploy platform you choose.  


## Testing

You can boot the app from the directory by `$  node lib/fayecom.js`

The below snippet was super helpful for testing if the server was online.

```
// Browser test Client Snippet, logs 3 if successful connection
var fayecom = new Fayecom({
  fayecom_address: '127.0.0.1',
  fayecom_protocol: 'http',
  fayecom_port: '8000'})

fayecom.subscriptions.add("/channel", function(message) {
  alert('got a message: ' + message);
});

setTimeout(function(){
  console.log(fayecom.fayeClient._state);
}, 500);
```


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
