// Ignore those pesky styles
// require('ignore-styles');

// Set up babel to do its thing... env for the latest toys, react-app for CRA
require('babel-register')({
  ignore: /\/(build|node_modules)\//,
  presets: ['env', 'es2015', 'stage-0', 'stage-3'],
})

require('babel-polyfill')

require('dotenv').load()
// Now that the nonsense is over... load up the server entry point
require('./app')
