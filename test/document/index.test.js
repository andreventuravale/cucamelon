const document = require('../../lib/document')

suite('Document template function', () => {
  setup(function () {
    this.steps = {
      'Laborum ut exercitation laborum anim enim ad sit dolore id.': () => {},
      'Dolor mollit nulla sit cupidatat nostrud adipisicing laboris eu consectetur sit minim.': () => {},
      'Dolor elit elit incididunt consequat esse elit.': () => {}
    }
  })

  document`
    Scenario: Aute et laborum laboris laborum pariatur laboris velit ea aliquip ut dolore cillum.

    Given Laborum ut exercitation laborum anim enim ad sit dolore id.
    And Dolor mollit nulla sit cupidatat nostrud adipisicing laboris eu consectetur sit minim.
    But Dolor elit elit incididunt consequat esse elit.
  `
})
