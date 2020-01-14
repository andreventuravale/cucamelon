const { expect } = require('chai')

const td = require('testdouble')

const document = require('../../lib/document')

const rewiremock = require('rewiremock').default

suite('Execution', () => {
  suite('Arguments', () => {
    suite('Typed', () => {
      suite.skip('The document template function calls the suite with hints for the types of the arguments.', () => {
        setup(function () {
          this.fakeSuite = td.func()
          this.fakeRun = () => {}

          this.document = rewiremock.proxy('../../lib/document', {
            './suite': () => this.fakeSuite,
            './run': this.fakeRun
          })
        })

        teardown(() => {
          td.reset()
        })

        test('Numbers', function () {
          this.document`
              Scenario: 1 + 2 = 3

              Given x is ${1}
              And y is ${2}
              When I sum x and y
              Then I get ${3}`

          td.verify(this.fakeSuite(`
              Scenario: 1 + 2 = 3

              Given x is {1:number}
              And y is {2:number}
              When I sum x and y
              Then I get {3:number}`, this.fakeRun))
        })
      })

      suite('The runner is aware of arguments hints and provides typed values to the step definitions.', () => {
        setup(function () {
          this.steps = {
            'x is (.*)': function (x) {
              expect(x).to.eql(1)
            },

            'y is (.*)': function (y) {
              expect(y).to.eql(2)
            },

            'I sum x and y': function (...args) {
              expect(args).to.eql([])
            },

            'I get (.*)': function (z) {
              expect(z).to.eql(3)
            }
          }
        })

        document`
          Scenario: 1 + 2 = 3

          Given x is ${1}
          And y is ${2}
          When I sum x and y
          Then I get ${3}
        `
      })
    })
  })
})
