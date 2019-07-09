const { expect } = require('chai')

const run = require('../src/run')

suite('Integration', () => {
  test('Each step executes itself plus all the others before', () => {
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

    const it = function (testText, testHandler) {
      this.steps = {
        'x is 1': setX,
        'y is 2': setY,
        'I sum x and y': sumXY,
        'I get 3': assertResult
      }

      testHandler.call(jasmineSuite)
    }

    global.it = it

    run.call(jasmineSuite)

    expect(callSequence).to.be.eqls([
      'setX',
      'setX', 'setY',
      'setX', 'setY', 'sumXY',
      'setX', 'setY', 'sumXY', 'assertResult'
    ])
  })

  test('Throws an error if the steps definitions were not found', () => {
    const jasmineSuite = {
      description: `
        Scenario: foo bar baz

        Given foo
        When bar
        Then baz
      `
    }

    const it = function (testText, testHandler) {
      this.steps = undefined

      testHandler.call(jasmineSuite)
    }

    global.it = it

    expect(() => {
      run.call(jasmineSuite)
    }).to.throw('The steps definitions were not found. You can set them before each or all tests.')
  })

  suite('Throws an error if a step definition is not found', () => {
    test('At very beginning', () => {
      const jasmineSuite = {
        description: `
        Scenario: foo bar baz

        Given foo
        When bar
        Then baz
      `
      }

      const it = function (testText, testHandler) {
        this.steps = {}

        testHandler.call(jasmineSuite)
      }

      global.it = it

      expect(() => {
        run.call(jasmineSuite)
      }).to.throw('Step not defined: foo')
    })

    test('In the middle', () => {
      const jasmineSuite = {
        description: `
        Scenario: foo bar baz

        Given foo
        When bar
        Then baz
      `
      }

      const it = function (testText, testHandler) {
        this.steps = {
          foo: () => { }
        }

        testHandler.call(jasmineSuite)
      }

      global.it = it

      expect(() => {
        run.call(jasmineSuite)
      }).to.throw('Step not defined: bar')
    })

    test('At very end', () => {
      const jasmineSuite = {
        description: `
        Scenario: foo bar baz

        Given foo
        When bar
        Then baz
      `
      }

      const it = function (testText, testHandler) {
        this.steps = {
          foo: () => { },
          bar: () => { }
        }

        testHandler.call(jasmineSuite)
      }

      global.it = it

      expect(() => {
        run.call(jasmineSuite)
      }).to.throw('Step not defined: baz')
    })
  })
})
