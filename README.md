[![Build Status](https://travis-ci.org/andreventuravale/gherkish.svg?branch=master)](https://travis-ci.org/andreventuravale/gherkish) [![Coverage Status](https://coveralls.io/repos/github/andreventuravale/gherkish/badge.svg)](https://coveralls.io/github/andreventuravale/gherkish)

## Table of Contents

1. [Usage](#usage)
2. [Install](#install)
3. [Roadmap](#roadmap)

<a id="usage">
  <h2 align="center">Usage</h2>
</a>

<h3>Node + Mocha + Chai</h2>

```javascript
const { expect } = require('chai')

const { runSteps } = require('gherkish')

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

<a id="install">
  <h2 align="center">Install</h2>
</a>

```bash
npm i gerkish --save-dev
```

or

```bash
yarn add gerkish --dev
```


<a id="roadmap">
  <h2 align="center">Roadmap</h2>
</a>

<h3>Completed</h2>

- [x] Mocha integration
  - [x] BDD style
  - [x] TDD style

<h3>Planned</h2>

- [ ] I18n
- [ ] Jasmine integration
- [ ] Jest integration
- [ ] Typed arguments

<h3>Under consideration</h2>

- [ ] **AST based parser covering most of Gherkin's syntax**
  - Pros:
    - Better semantics and possibilities
  - Cons:
    - Increased complexity
