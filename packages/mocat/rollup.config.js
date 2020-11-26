require('ts-node').register({
  compilerOptions: {
    module: 'CommonJS',
  },
})

module.exports = require('@mocat/rollup-config')
