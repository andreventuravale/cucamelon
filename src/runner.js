const parse = require('./parse')

module.exports = function () {
  const text = this.description

  const { it } = global

  const steps = parse(text)

  steps.forEach(({ text }) => it(text, () => {}))
}
