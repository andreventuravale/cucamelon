const parse = require('./parse')

module.exports = function () {
  const text = this.description

  const { it } = global

  const steps = parse(text)

  steps.forEach(
    ({ text }, stepIndex) => it(
      text,
      function () {
        const spec = this

        for (let i = 0; i <= stepIndex; i++) {
          const { step } = steps[i]

          const definition = spec.steps[step]

          if (!definition) {
            throw new Error(`Step not defined: "${step}"`)
          }

          definition.handler.apply(spec)
        }
      }
    )
  )
}
