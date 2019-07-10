const { expect } = require('chai')

const { runSteps } = require('../lib')

suite('Samples', () => {
  suite('Extracted arguments', () => {
    setup(function () {
      this.steps = {
        'x is (.*)': function (x) {
          this.x = Number(x)
        },

        'y is (.*)': function (y) {
          this.y = Number(y)
        },

        'I sum x and y': function () {
          this.z = this.x + this.y
        },

        'I get (.*)': function (z) {
          expect(this.z).to.eql(Number(z))
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
})
