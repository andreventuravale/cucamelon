const parse = require('./parse')
const run = require('./run')
const suite = require('./suite')

module.exports = function (steps, ...args) {
  const lines = []

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    if (args.length) {
      const arg = args.shift()
      lines.push(`${step}${arg}`)
    } else {
      lines.push(step)
    }
  }

  const text = lines.join('')

  const metadata = parse(text)

  const kw = metadata.nodes && metadata.nodes.find(w => w.type === 'token' && w.subtype === 'keyword').text

  const title = metadata.nodes && metadata.nodes.find(w => w.type === 'title').text

  const summaryIndent = '      '

  const summary = metadata.nodes && metadata.nodes.filter(w => w.type === 'summary')
    .map(w => `${summaryIndent}${w.text}`)
    .join(`\n`)

  const suiteFn = suite()

  suiteFn(`${kw}: ${title}` + '\n\n' + summary + '\n', run(metadata))
}
