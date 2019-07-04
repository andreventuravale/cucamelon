function defineSteps (spec, steps) {
  spec.steps = Object
    .keys(steps)
    .reduce((hash, step) => {
      const pattern = step // .replace(/\{[^{}]*\}/g, '.*')
      const handler = steps[step]
      // const params = step.match(/\{[^{}]*\}/g) || []
      hash[pattern] = { handler }
      return hash
    }, {})
}

module.exports = defineSteps
