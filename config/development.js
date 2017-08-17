const config = {
  workingDirectory: process.env.WORKING_DIRECTORY || 'bin/',
  color: process.env.COLOR || 'green',
  env: process.env.ENV || 'development'
};

config.coveo = {
  platformUrl: process.env.PLATFORM_URL || 'https://platformdev.cloud.coveo.com'
}

module.exports = config;