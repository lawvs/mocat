'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/main.cjs.prod.js')
} else {
  module.exports = require('./build/main.cjs.js')
}
