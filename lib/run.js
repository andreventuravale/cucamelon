const it = require('./it')
const parse = require('./parse')
const runCore = require('./runCore')

module.exports = function () {
  const metadata = parse(this.title || this.description)
  return runCore(metadata, it())
}
