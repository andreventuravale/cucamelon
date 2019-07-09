const parse = require('./parse')

module.exports = function () {
  const text = this.description

  const { it } = global

  const steps = parse(text)

  steps.forEach(
    ({ text }, stepIndex) => it.call(
      this,
      text,
      function () {
        const spec = this

        if (typeof spec.steps !== 'object') {
          throw new Error('The steps definitions were not found. You can set them before each or all tests.')
        }

        for (let i = 0; i <= stepIndex; i++) {
          const { step } = steps[i]

          const stepDefinition = spec.steps[step]

          if (!stepDefinition) {
            throw new Error(`Step not defined: ${step}`)
          }

          stepDefinition.apply(spec)
        }
      }
    )
  )
}
