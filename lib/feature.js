const run = require('./run')
const suite = require('./suite')

const suiteFn = suite()

module.exports = function (steps, ...args) {
  const lines = []

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    if (args.length) {
      const arg = args.shift()
      lines.push(`${step}{${arg}:${typeof arg}}`)
    }
  }

  const text = lines.join('')

  suiteFn(text, run)
}
