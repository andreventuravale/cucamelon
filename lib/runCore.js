function fillDataTable (parsedStep, args) {
  const nodeTable = parsedStep.nodes.find(w => w.type === 'table')

  if (nodeTable) {
    const headerRow = nodeTable.nodes.slice(0, 1)[0]
    const dataRows = nodeTable.nodes.slice(1)
    const keys = headerRow.nodes.map(({ text }) => text)

    const table = dataRows.map(row => row.nodes.reduce((data, { text }, index) => {
      data[keys[index]] = text
      return data
    }, {}))

    args.push(table)
  }
}

function compileStepDefinition (spec, stepDefinition) {
  const converterMap = { json: JSON.parse, number: Number, date: Date, object: Object, string: String }
  const definitions = Object.keys(spec.steps)
  let converters = []
  let definition
  let didMatch
  let pattern
  let regex

  for (let index = 0; !didMatch && index < definitions.length; index++) {
    definition = definitions[index]

    pattern = definition.replace(/[^\w\s]/g, ch => `\\${ch}`)

    pattern = pattern.replace(/\\{(\w+)\\}/g, (hint, type) => {
      if (!converterMap[type]) {
        throw new Error(`Step "${definition}" asks for an unknow argument type: "${type}". Please use one of the following: ${Object.keys(converterMap).reverse().map((type, i) => i ? `, "${type}"` : ` or "${type}"`).reverse().join('').slice(2)}.`)
      }

      converters.push(converterMap[type])

      return '(.*)'
    })

    regex = new RegExp(pattern, '')

    didMatch = regex.test(stepDefinition)
  }

  if (!didMatch) {
    throw new Error(`No step definition found that matches: \`${stepDefinition}\``)
  }

  const args = stepDefinition
    .match(regex)
    .slice(1)
    .map((value, index) => converters[index](value))

  return spec.steps[definition].bind(spec, ...args)
}

module.exports = function (metadata, it) {
  const parsedSteps = metadata.nodes && metadata.nodes.filter(w => w.type === 'step')

  parsedSteps && parsedSteps.forEach((currParsedStep, currStepIndex) => {
    const currStepKeywordNode = currParsedStep.nodes.find(w => w.type === 'token' && w.subtype === 'keyword')
    const currStepDefNode = currParsedStep.nodes.find(w => w.type === 'definition')
    const currStepSpecDesc = `${currStepKeywordNode.text} ${currStepDefNode.text}`

    it(
      currStepSpecDesc,
      function () {
        const spec = this

        if (typeof spec.steps !== 'object') {
          throw new Error('The step definitions were not found ( "this.steps" ).')
        }

        for (let prevStepIndex = 0; prevStepIndex <= currStepIndex; prevStepIndex++) {
          const prevParsedStep = parsedSteps[prevStepIndex]
          const prevStepDefNode = prevParsedStep.nodes.find(w => w.type === 'definition')
          const step = compileStepDefinition(spec, prevStepDefNode.text)
          const extraArgs = []

          fillDataTable(prevParsedStep, extraArgs)

          step(...extraArgs)
        }
      }
    )
  })
}
