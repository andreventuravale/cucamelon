const it = require('./it')
const runner = require('./runner')

module.exports = function (metadata) {
  return () => {
    return runner(metadata, it())
  }
}
