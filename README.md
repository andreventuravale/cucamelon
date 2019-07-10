[![Build Status](https://travis-ci.org/andreventuravale/gherkish.svg?branch=master)](https://travis-ci.org/andreventuravale/gherkish) [![Coverage Status](https://coveralls.io/repos/github/andreventuravale/gherkish/badge.svg)](https://coveralls.io/github/andreventuravale/gherkish)

#### Usage examples

##### Node + Mocha + Chai

```javascript
const { expect } = require('chai')

const { runSteps } = require('../../../src')

suite('Basic Math', () => {
  setup(function () {
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

  suite(`
    Scenario: 1 + 2 = 3

    Given x is 1
    And y is 2
    When I sum x and y
    Then I get 3
  `, runSteps)
  })
})
```

#### Roadmap

##### Completed

- [x] Mocha integration
  - [x] BDD style
  - [x] TDD style

##### Pending

- [ ] i18n
- [ ] Jasmine integration
- [ ] Jest integration
- [ ] Typed arguments
