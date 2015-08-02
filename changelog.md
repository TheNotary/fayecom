# 0.0.x

  - the server will host files of http or https when an https server is
    configured, but it won't do websockets correctly over http when https
    is selected...

  - Add package.json
  - implement versioning

finished:
  - Uses system of serving sockets on 8000 and tls mode 8001
  - Now servering ssl by default (which also falls back to http, nice!)
  - make the server echo messages...
  - Authenticates publishers

