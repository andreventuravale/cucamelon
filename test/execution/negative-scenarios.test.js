const { expect } = require('chai')
const rewiremock = require('rewiremock').default

suite('Execution', () => {
  suite('Negative Scenarios', () => {
    setup(function () {
      this.testInstance = {}

      this.fakeIt = function (title, fn) {
        fn.apply(this, arguments)
      }.bind(this.testInstance)

      rewiremock.forceCacheClear()

      this.run = rewiremock.proxy('../../lib/run', {
        './it': () => this.fakeIt
      })()
    })

    test('Invalid gherkin input', function () {
      const suiteInstance = {
        title: `foo bar`
      }

      expect(() => {
        this.run.call(suiteInstance)
      }).to.throw(`Sorry I could not understand the gherkin:

\`\`\`
foo bar
\`\`\`

I was specting a feature, background, scenario, scenario outline, example, etc.`)
    })

    test('Failed expectations propagates to the testing host/runner', function () {
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
        'x is {number}': x => expect(x).to.eql(1),
        'y is {number}': y => expect(y).to.eql(2),
        'I sum x and y': (...args) => expect(args).to.eql([]),
        'I get {number}': z => expect(z).to.eql(3)
      }

      expect(() => {
        this.testInstance.steps = {
          ...fineSteps,
          'x is {number}': () => expect(true, 'This step was forced to fail').to.eql(false)
        }

        this.run.call(suiteInstance)
      }).to.throw(/This step was forced to fail/)

      expect(() => {
        this.testInstance.steps = {
          ...fineSteps,
          'y is {number}': () => expect(true, 'This step was forced to fail').to.eql(false)
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
          'I get {number}': () => expect(true, 'This step was forced to fail').to.eql(false)
        }

        this.run.call(suiteInstance)
      }).to.throw(/This step was forced to fail/)
    })
  })
})
