const it = require('./it')
const parse = require('./parse')

module.exports = function () {
  const scenarioText = this.title || this.description

  const testFn = it()

  const parsedSteps = parse(scenarioText)

  parsedSteps.forEach(({ text }, stepIndex) => testFn(
    text,
    function () {
      const testInstance = this

      if (typeof testInstance.steps !== 'object') {
        throw new Error('The steps definitions were not found. You can set them before each or all tests.')
      }

      for (let i = 0; i <= stepIndex; i++) {
        const { step: parsedStep } = parsedSteps[i]

        const keys = Object.keys(testInstance.steps)

        let didMatch = false
        let pattern = ''
        let regex = {}
        let stepIndex = -1

        do {
          stepIndex++
          pattern = keys[stepIndex]
          regex = new RegExp(pattern)
          didMatch = regex.test(parsedStep)
        } while (stepIndex < keys.length && !didMatch)

        if (stepIndex >= keys.length || !didMatch) {
          throw new Error(`Step not defined: ${parsedStep}`)
        }

        const stepDefinition = testInstance.steps[pattern]

        const args = parsedStep
          .match(regex)
          .slice(1)
          .map((capture) => {
            const hint = /^{(.+):(.+)}$/.exec(capture)
            if (hint) {
              const [, literal, typeName] = hint
              return ({
                number: () => Number(literal)
              })[typeName]()
            }
            return capture
          })

        stepDefinition.apply(testInstance, args)
      }
    }
  ))
}
