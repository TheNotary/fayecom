# 0.0.x

  - the server will host files of http or https when an https server is
    configured, but it won't do websockets correctly over http when https
    is selected...

currently:

  - implement a configuration file



finished:

  - CORE:  restructured project layout, now distributed as binary package
  - API: added /version for looking up fayecom version

# 0.0.1
  - implemented versioning
  - Uses system of serving sockets on 8000 and ssl mode 8001
  - Authenticates publishers

