const { expect } = require('chai')

const parse = require('../src/parse')

const rewiremock = require('rewiremock').default

suite('Execution', function () {
  setup(function () {
    this.testInstance = {}

    this.fakeIt = function (title, fn) {
      fn.apply(this, arguments)
    }.bind(this.testInstance)

    this.run = rewiremock.proxy('../src/run', {
      it: () => this.fakeIt,
      test: () => this.fakeIt,
      parse: parse
    })
  })

  test('Each step executes itself plus all the others before', function () {
    const suiteInstance = {
      description: `
        Scenario: 1 + 2 = 3

        Given x is 1
        And y is 2
        When I sum x and y
        Then I get 3
      `
    }

    const callSequence = []

    const that = this

    const assertAndTrackCall = (stepName) => {
      return function () {
        callSequence.push(stepName)
        expect(this).to.be.eql(that.testInstance)
      }
    }

    const setX = assertAndTrackCall('setX')
    const setY = assertAndTrackCall('setY')
    const sumXY = assertAndTrackCall('sumXY')
    const assertResult = assertAndTrackCall('assertResult')

    this.testInstance.steps = {
      'x is 1': setX,
      'y is 2': setY,
      'I sum x and y': sumXY,
      'I get 3': assertResult
    }

    this.run.call(suiteInstance)

    expect(callSequence).to.be.eqls([
      'setX',
      'setX', 'setY',
      'setX', 'setY', 'sumXY',
      'setX', 'setY', 'sumXY', 'assertResult'
    ])
  })

  test('Throws an error if the steps definitions were not found', function () {
    const suiteInstance = {
      description: `
        Scenario: foo bar baz

        Given foo
        When bar
        Then baz
      `
    }

    expect(() => {
      this.run.call(suiteInstance)
    }).to.throw('The steps definitions were not found. You can set them before each or all tests.')
  })

  suite('Throws an error if a step definition is not found', function () {
    test('At very beginning', function () {
      const suiteInstance = {
        description: `
          Scenario: foo bar baz

          Given foo
          When bar
          Then baz
        `
      }

      this.testInstance.steps = {}

      expect(() => {
        this.run.call(suiteInstance)
      }).to.throw('Step not defined: foo')
    })

    test('In the middle', function () {
      const suiteInstance = {
        description: `
          Scenario: foo bar baz

          Given foo
          When bar
          Then baz
        `
      }

      this.testInstance.steps = {
        foo: function () { }
      }

      expect(() => {
        this.run.call(suiteInstance)
      }).to.throw('Step not defined: bar')
    })

    test('At very end', function () {
      const suiteInstance = {
        description: `
        Scenario: foo bar baz

        Given foo
        When bar
        Then baz
      `
      }

      this.testInstance.steps = {
        foo: function () { },
        bar: function () { }
      }

      expect(() => {
        this.run.call(suiteInstance)
      }).to.throw('Step not defined: baz')
    })
  })
})
