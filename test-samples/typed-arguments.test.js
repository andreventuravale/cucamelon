const { expect } = require('chai')

const { document } = require('../lib')

suite('Samples', () => {
  suite('Typed arguments', () => {
    setup(function () {
      this.steps = {
        'x is (.*)': function (x) { this.x = x },
        'I add (.*) to x': function (add) { this.x += add },
        'y is (.*)': function (y) { this.y = y },
        'I sum x and y': function () { this.z = this.x + this.y },
        'I get (.*)': function (z) { expect(this.z).to.eql(z) }
      }
    })

    document`
      Scenario: Basic math

      Given x is ${1}
      And I add ${10} to x
      And I add ${20} to x
      And y is ${2}
      When I sum x and y
      Then I get ${33}
    `
  })
})
