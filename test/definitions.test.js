const { expect } = require('chai')
const td = require('testdouble')

const defineSteps = require('../src/defineSteps')

suite('Definitions', () => {
  test('Defines all the steps in the spec context', () => {
    const it = td.func()

    const spec = {}

    global.it = it

    const handlers = [
      () => {},
      () => {},
      () => {},
      () => {}
    ]

    defineSteps(spec, {
      'x is 1': handlers[0],
      'y is 2': handlers[1],
      'I sum x and y': handlers[2],
      'I get 3': handlers[3]
    })

    expect(spec.steps).to.be.deep.equals({
      'x is 1': { handler: handlers[0] },
      'y is 2': { handler: handlers[1] },
      'I sum x and y': { handler: handlers[2] },
      'I get 3': { handler: handlers[3] }
    })
  })
})
