const { expect } = require('chai')
const rewiremock = require('rewiremock').default

suite('Execution', () => {
  setup(function () {
    this.testInstance = {}

    this.fakeIt = function (title, fn) {
      fn.apply(this, arguments)
    }.bind(this.testInstance)

    rewiremock.forceCacheClear()

    this.run = rewiremock.proxy('../../lib/run', {
      './it': () => this.fakeIt
    })
  })

  test('Each step executes itself plus all the others before', function () {
    const suiteInstance = {
      title: `
        Scenario: 1 + 2 = 3

        Given x is 1
        And y is 2
        When I sum x and y
        Then I get 3
      `
    }

    const callSequence = []

    const that = this

    const assertStepCall = stepName => function () {
      callSequence.push(stepName)

      expect(this, 'The step was called with the wrong context').to.be.eql(that.testInstance)
    }

    const setX = assertStepCall('setX')
    const setY = assertStepCall('setY')
    const sumXY = assertStepCall('sumXY')
    const assertResult = assertStepCall('assertResult')

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

  test('Throws an error if the step definitions were not found', function () {
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
    }).to.throw('The step definitions were not found ( "this.steps" ).')
  })

  suite('Throws an error if a step definition is not found', () => {
    test('At the very beginning', function () {
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
      }).to.throw('No step definition found that matches: `foo`')
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
        foo () { }
      }

      expect(() => {
        this.run.call(suiteInstance)
      }).to.throw('No step definition found that matches: `bar`')
    })

    test('At the very end', function () {
      const suiteInstance = {
        description: `
        Scenario: foo bar baz

        Given foo
        When bar
        Then baz
      `
      }

      this.testInstance.steps = {
        foo () { },
        bar () { }
      }

      expect(() => {
        this.run.call(suiteInstance)
      }).to.throw('No step definition found that matches: `baz`')
    })
  })
})
