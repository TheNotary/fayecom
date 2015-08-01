## FayeCom
This is a nodejs app that allows for passing messages to clients using efficient websockets on an as-needed basis.  

## Install

# Install nodejs (compile from source)

# Install npm (compile from source)

# Install faye's stuff into this project's dir if needed
    npm install faye

## Configuration

Configuration values are just at the top of app.js.
You can specify the port to run on, the name of the environment variable that contains the authentication token, ...

### server only publishing
This app is designed to allow only the server to publish messages to the subscribers.  
This rule is enforced with a secret authentication token named 

## Usage

Start the app.  
    `$  node app.js`

Clients can now connect.  This system is designed to interact with MANY browser clients, and usually ~1 ruby server client (who talks to all the clients).  

It's even better to use the node package `forever` to keep the server running.  

    $  npm install -g forever
    
    $  forever list
    $  forever start app.js
    $  forever stop 0


