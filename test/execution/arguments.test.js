const { expect } = require('chai')
const { runSteps } = require('../../lib')
const rewiremock = require('rewiremock').default

suite('Execution', () => {
  suite('Arguments', () => {
    suite('Figures out the arguments by matching the scenario against the step definitions.', () => {
      setup(function () {
        this.steps = {
          'x is {number}': function (...args) {
            expect(args).to.eql([1])
          },

          'y is {number}': function (...args) {
            expect(args).to.eql([2])
          },

          'I sum x and y': function (...args) {
            expect(args).to.eql([])
          },

          'I get {number}': function (...args) {
            expect(args).to.eql([3])
          }
        }
      })

      suite(`
        Scenario: 1 + 2 = 3

        Given x is 1
        And y is 2
        When I sum x and y
        Then I get 3
      `, runSteps)
    })

    suite('Unknow argument types.', () => {
      setup(function () {
        this.fakeSpec = {
          title: `
            Scenario: 1 + 2 = 3

            Given x is 1
            And y is 2
            When I sum x and y
            Then I get 3
          `,
          steps: {
            'x is {foo}': function () {}
          }
        }

        this.fakeIt = () => (title, callback) => {
          callback.call(this.fakeSpec)
        }

        rewiremock.forceCacheClear()

        this.run = rewiremock.proxy('../../lib/run', {
          './it': this.fakeIt
        })
      })

      test(`"foo" isn't a valid type`, function () {
        expect(() => {
          this.run().call(this.fakeSpec)
        }).to.throw('Step "x is {foo}" asks for an unknow argument type: "foo". Please use one of the following: "json", "number", "date", "object" or "string".')
      })
    })
  })
})
