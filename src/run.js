const it = require('./it')
const parse = require('./parse')

module.exports = function () {
  const scenarioText = this.title || this.description

  const testFn = it()

  const parsedSteps = parse(scenarioText)

  parsedSteps.forEach(
    ({ text }, stepIndex) => testFn(
      text,
      function () {
        const testInstance = this

        if (typeof testInstance.steps !== 'object') {
          throw new Error('The steps definitions were not found. You can set them before each or all tests.')
        }

        for (let i = 0; i <= stepIndex; i++) {
          const { step } = parsedSteps[i]

          const stepDefinition = testInstance.steps[step]

          if (!stepDefinition) {
            throw new Error(`Step not defined: ${step}`)
          }

          stepDefinition.apply(testInstance)
        }
      }
    )
  )
}
