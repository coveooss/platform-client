const config = {};

// TODO: classify those config
config.workingDirectory = process.env.WORKING_DIRECTORY || 'bin/';
config.color = process.env.COLOR || 'green';
config.env = process.env.ENV || 'development';

// Coveo Config
config.coveo = {};
config.coveo.platformUrl = process.env.PLATFORM_URL || 'https://platformdev.cloud.coveo.com';

module.exports = config;