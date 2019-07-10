const { expect } = require('chai')

const rewiremock = require('rewiremock').default

suite.only('Execution', function () {
  suite('Negative Scenarios', function () {
    setup(function () {
      this.testInstance = {}

      this.fakeIt = function (title, fn) {
        fn.apply(this, arguments)
      }.bind(this.testInstance)

      this.run = rewiremock.proxy('../../src/run', {
        it: () => this.fakeIt,
        test: () => this.fakeIt
      })
    })

    test('Failed expectations propagate to the testing host', function () {
      const suiteInstance = {
        title: `
          Scenario: 1 + 2 = 3

          Given x is 1
          And y is 2
          When I sum x and y
          Then I get 3
        `
      }

      const fineSteps = {
        'x is (.*)': (x) => expect(x).to.eql('1'),
        'y is (.*)': (y) => expect(y).to.eql('2'),
        'I sum x and y': (...args) => expect(args).to.eql([]),
        'I get (.*)': (z) => expect(z).to.eql('3')
      }

      expect(() => {
        this.testInstance.steps = {
          ...fineSteps,
          'x is (.*)': () => expect(true, 'This step was forced to fail').to.eql(false)
        }

        this.run.call(suiteInstance)
      }).to.throw(/This step was forced to fail/)

      expect(() => {
        this.testInstance.steps = {
          ...fineSteps,
          'y is (.*)': () => expect(true, 'This step was forced to fail').to.eql(false)
        }

        this.run.call(suiteInstance)
      }).to.throw(/This step was forced to fail/)

      expect(() => {
        this.testInstance.steps = {
          ...fineSteps,
          'I sum x and y': () => expect(true, 'This step was forced to fail').to.eql(false)
        }

        this.run.call(suiteInstance)
      }).to.throw(/This step was forced to fail/)

      expect(() => {
        this.testInstance.steps = {
          ...fineSteps,
          'I get (.*)': () => expect(true, 'This step was forced to fail').to.eql(false)
        }

        this.run.call(suiteInstance)
      }).to.throw(/This step was forced to fail/)
    })
  })
})
