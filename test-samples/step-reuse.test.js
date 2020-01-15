const { expect } = require('chai')

const { Scenario } = require('../lib')

suite('Samples', () => {
  suite('Step reuse', () => {
    setup(function () {
      this.steps = {
        'x is {number}': function (x) {
          this.x = x
        },

        'I add {number} to x': function (add) {
          this.x += add
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

    Scenario`: 1 + 2 = 3

      Given x is 1
      And I add 10 to x
      And I add 20 to x
      And y is 2
      When I sum x and y
      Then I get 33
    `
  })
})
