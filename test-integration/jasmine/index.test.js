const { expect } = require('chai')

const { runSteps } = require('../../src')

describe('Integration', () => {
  describe('Jasmine', () => {
    beforeEach(function () {
      this.steps = {
        'x is 1': function () {
          this.x = 1
        },

        'y is 2': function () {
          this.y = 2
        },

        'I sum x and y': function () {
          this.z = this.x + this.y
        },

        'I get 3': function () {
          expect(this.z).to.eql(3)
        }
      }
    })

    describe(`
      Scenario: 1 + 2 = 3

      Given x is 1
      And y is 2
      When I sum x and y
      Then I get 3
    `, runSteps)
  })
})
