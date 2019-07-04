const { expect } = require('chai')
const td = require('testdouble')

const run = require('../src/runner')
const defineSteps = require('../src/defineSteps')

suite('Integration', () => {
  suite('Jasmine', () => {
    test('Calls "it" for each step found', () => {
      const jasmineSuite = {
        description: `
          Scenario: 1 + 2 = 3
  
          Given x is 1
          And y is 2
          When I sum x and y
          Then I get 3
        `
      }

      const jasmineIt = td.func()

      global.it = jasmineIt

      run.call(jasmineSuite)

      td.verify(jasmineIt('Given x is 1', td.matchers.isA(Function)))
      td.verify(jasmineIt('And y is 2', td.matchers.isA(Function)))
      td.verify(jasmineIt('When I sum x and y', td.matchers.isA(Function)))
      td.verify(jasmineIt('Then I get 3', td.matchers.isA(Function)))
    })

    test('Re-executed are all the steps before the current one.', () => {
      const jasmineSuite = {
        description: `
          Scenario: 1 + 2 = 3
  
          Given x is 1
          And y is 2
          When I sum x and y
          Then I get 3
        `
      }

      const callSequence = []

      const assertAndTrackCall = (stepName) => {
        return function () {
          callSequence.push(stepName)
          expect(this).to.be.eql(jasmineSuite)
        }
      }

      const setX = assertAndTrackCall('setX')
      const setY = assertAndTrackCall('setY')
      const sumXY = assertAndTrackCall('sumXY')
      const assertResult = assertAndTrackCall('assertResult')

      defineSteps(jasmineSuite, {
        'x is 1': setX,
        'y is 2': setY,
        'I sum x and y': sumXY,
        'I get 3': assertResult
      })

      const jasmineIt = function (testText, testHandler) {
        testHandler.call(jasmineSuite)
      }

      global.it = jasmineIt

      run.call(jasmineSuite)

      expect(callSequence).to.be.eqls([
        'setX',
        'setX', 'setY',
        'setX', 'setY', 'sumXY',
        'setX', 'setY', 'sumXY', 'assertResult'
      ])
    })
  })
})
