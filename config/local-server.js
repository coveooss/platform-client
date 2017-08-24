const config = {};

// TODO: classify those config
config.workingDirectory = 'bin/';
config.color = 'yellow';
config.env = 'local-server';

// Coveo Config
config.coveo = {};
config.coveo.platformUrl = 'http://localhost:3000';

module.exports = config;