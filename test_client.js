var http = require('http'),
    faye = require('faye');

var client = new faye.Client('http://localhost:8000/faye');

client.subscribe('h1');

//client.publish('h1', "hello");
