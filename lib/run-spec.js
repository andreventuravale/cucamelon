const it = require('./it')
const parse = require('./parse')
const runner = require('./runner')

module.exports = function () {
  const metadata = parse(this.title || this.description)
  return runner(metadata, it())
}
