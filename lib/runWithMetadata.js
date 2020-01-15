const it = require('./it')
const runCore = require('./runCore')

module.exports = function (metadata) {
  return () => {
    return runCore(metadata, it())
  }
}
