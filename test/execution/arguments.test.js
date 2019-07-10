const { expect } = require('chai')

const run = require('../../src/run')

suite('Execution', function () {
  suite('Arguments', function () {
    suite('Figures out the arguments by matching the scenario input against the steps definitions.', () => {
      setup(function () {
        this.steps = {
          'x is (.*)': function (x) {
            expect(x).to.eql('1')
          },

          'y is (.*)': function (y) {
            expect(y).to.eql('2')
          },

          'I sum x and y': function (...args) {
            expect(args).to.eql([])
          },

          'I get (.*)': function (z) {
            expect(z).to.eql('3')
          }
        }
      })

      suite(`
        Scenario: 1 + 2 = 3

        Given x is 1
        And y is 2
        When I sum x and y
        Then I get 3
      `, run)
    })
  })
})
