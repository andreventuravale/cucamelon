const run = require('../src/runner')

const td = require('testdouble')

suite('Integration', () => {
  suite('Jasmine', () => {
    test('Calls "it" for each step found', () => {
      const it = td.func()

      global.it = it

      run.call({
        description: `
          Scenario: 1 + 2 = 3
  
          Given x is 1
          And y is 2
          When I sum x and y
          Then I get 3
        `
      })

      td.verify(it('Given x is 1', td.matchers.isA(Function)))
      td.verify(it('And y is 2', td.matchers.isA(Function)))
      td.verify(it('When I sum x and y', td.matchers.isA(Function)))
      td.verify(it('Then I get 3', td.matchers.isA(Function)))
    })
  })
})
