const { expect } = require('chai')
const run = require('../../lib/run-spec')

suite('Execution', () => {
  suite('Data tables', () => {
    setup(function () {
      this.steps = {
        'an age table': function (table) {
          expect(table).to.eql([
            { 'the  name': 'foo', 'the age': '10' },
            { 'the  name': 'bar', 'the age': '20' },
            { 'the  name': 'baz', 'the age': '30' }
          ])
        }
      }
    })

    suite(`
      Scenario: tables

      Given an age table
        | the  name  |the age |
        |         foo|10      | 
        |    bar     |   20   |
        | baz        |      30|
    `, run)
  })
})
