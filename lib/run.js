const it = require('./it')
const parse = require('./parse')
const testFn = it()

module.exports = function (metadata) {
  return function () {
    const title = this.title || this.description || ''

    metadata = metadata || parse(title)

    const stepsMetadata = metadata.nodes && metadata.nodes.filter(w => w.type === 'step')

    stepsMetadata && stepsMetadata.forEach((currentStepMetadata, currentStepIndex) => {
      const kw = currentStepMetadata.nodes.find(w => w.type === 'token' && w.subtype === 'keyword').text
      const def = currentStepMetadata.nodes.find(w => w.type === 'definition').text
      const text = `${kw} ${def}`

      testFn(
        text,
        function () {
          const testInstance = this

          const implementedSteps = testInstance.steps

          if (typeof implementedSteps !== 'object') {
            throw new Error('The steps definitions were not found. You can set them before each or all tests.')
          }

          const implementedDefinitions = Object.keys(implementedSteps)

          for (let prevStepIndex = 0; prevStepIndex <= currentStepIndex; prevStepIndex++) {
            const prevStepMetadata = stepsMetadata[prevStepIndex]

            const prevStepDefinition = prevStepMetadata.nodes.find(w => w.type === 'definition').text

            const { implementation, regex } = findImplementation(
              implementedSteps,
              implementedDefinitions,
              prevStepDefinition
            )

            const args = extractArguments(prevStepDefinition, regex)

            implementation.apply(testInstance, args)
          }
        }
      )
    })
  }

  function findImplementation (implementedSteps, implementedDefinitions, stepDefinition) {
    let didMatch
    let index = -1
    let pattern
    let regex

    do {
      index++
      pattern = implementedDefinitions[index]
      regex = new RegExp(pattern)
      didMatch = regex.test(stepDefinition)
    } while (index < implementedDefinitions.length && !didMatch)

    if (index >= implementedDefinitions.length || !didMatch) {
      throw new Error(`Step not defined: ${stepDefinition}`)
    }

    const implementation = implementedSteps[pattern]

    return { implementation, regex }
  }

  function extractArguments (stepDefinition, regex) {
    return stepDefinition
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
  }
}
