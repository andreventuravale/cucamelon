const { expect } = require('chai')

const { document } = require('../lib')

suite('Samples', () => {
  suite('Extracted arguments', () => {
    setup(function () {
      this.steps = {
        'x is {number}': function (x) {
          this.x = x
        },

        'y is {number}': function (y) {
          this.y = y
        },

        'I sum x and y': function () {
          this.z = this.x + this.y
        },

        'I get {number}': function (z) {
          expect(this.z).to.eql(z)
        }
      }
    })

    document`
      Scenario: 1 + 2 = 3

      Given x is 1
      And y is 2
      When I sum x and y
      Then I get 3
    `
  })
})
