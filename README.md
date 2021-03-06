[![Build Status](https://travis-ci.org/andreventuravale/cucamelon.svg?branch=master)](https://travis-ci.org/andreventuravale/cucamelon) [![Coverage Status](https://coveralls.io/repos/github/andreventuravale/cucamelon/badge.svg)](https://coveralls.io/github/andreventuravale/cucamelon)

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

const { Scenario } = require('cucamelon')

suite('Basic Math', () => {
  setup(function () {
    this.steps = {
      'x is {number}'      : function (x)   { this.x = x },
      'I add {number} to x': function (add) { this.x += add },
      'y is {number}'      : function (y)   { this.y = y },
      'I sum x and y'      : function ()    { this.z = this.x + this.y },
      'I get {number}'     : function (z)   { expect(this.z).to.eql(z) }
    }
  })

  Scenario`: Basic math

    Given x is ${1}
    And I add ${10} to x
    And I add ${20} to x
    And y is ${2}
    When I sum x and y
    Then I get ${33}
  `
})
```

<a id="install">
  <h2 align="center">Install</h2>
</a>

```bash
npm i cucamelon --save-dev
```

or

```bash
yarn add cucamelon --dev
```


<a id="roadmap">
  <h2 align="center">Roadmap</h2>
</a>

<h3>Completed</h2>

- [x] Mocha integration
  - [x] BDD style
  - [x] TDD style
- [x] Jasmine integration
- [x] AST based parser covering most of Gherkin's syntax ( nanospec based )
- [x] Typed arguments


<h3>Planned</h2>

- [ ] I18n
- [ ] Jest integration

<h3>Under consideration</h2>
