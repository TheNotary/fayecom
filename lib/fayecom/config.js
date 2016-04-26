var appRoot = require('path').resolve(__dirname + "/../.."),
    env = require(appRoot + '/env.json');


function getConfigs() {
  var node_env = process.env.NODE_ENV || 'development',
      configs = {};

  Object.keys(env[node_env]).forEach(function (key) {
    var value = env[node_env][key];

    // Use actual env vars if they exist in
    if (process.env[key] != null) {
      console.log("ENV variable found, ignoring env.json value for " + key);
      configs[key] = process.env[key];
    }
    else {
      configs[key] = value;
      process.env[key] = value;
    }

  });

  return configs;
};

module.exports = getConfigs();
