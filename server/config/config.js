require('dotenv').config();
const merge = require('lodash/fp/merge')

let config = {
  dev: 'development',
  test: 'testing',
  prod: 'production',
  port: process.env.PORT || 8080,
  tokenExpiration: 24 * 60 * 7,
  jwtSecret: process.env.JWT_SECRET
}

// use NODE_ENV, otherwise default to development
process.env.NODE_ENV = process.env.NODE_ENV || config.dev
config.env = process.env.NODE_ENV

let environmentConfig = require(`./${config.env}`)

module.exports = merge(config, environmentConfig)
