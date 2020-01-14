const rewiremock = require('rewiremock').default
const td = require('testdouble')

const isADeeplyEqualObject = td.matchers.create({
  name: 'isADeeplyEqualObject',
  matches: function ([a], b) {
    return JSON.stringify(a) === JSON.stringify(b)
  }
})

suite('Document template function', () => {
  setup(function () {
    this.testInstance = {
      steps: {
        'Laborum ut exercitation laborum anim enim ad sit dolore id.': () => { },
        'Dolor mollit nulla sit cupidatat nostrud adipisicing laboris eu consectetur sit minim.': () => { },
        'Dolor elit elit incididunt consequat esse elit.': () => { }
      }
    }

    this.fakeRun = td.func()
    this.fakeSuite = td.func()

    this.document = rewiremock.proxy('../../lib/document', {
      './run': this.fakeRun,
      './suite': () => this.fakeSuite
    })
  })

  teardown(() => td.reset())

  test('Calls the suite definition as expected and delegates execution to the run function', function () {
    td.when(
      this.fakeRun(
        isADeeplyEqualObject(
          {
            'type': 'statement',
            'subtype': 'scenario',
            'nodes': [
              {
                'type': 'title',
                'text': 'Aute et laborum laboris laborum pariatur laboris velit ea aliquip ut dolore cillum.'
              },
              {
                'type': 'summary',
                'text': 'Culpa nisi tempor sint voluptate cupidatat laborum ex duis non duis aliqua enim ex irure.'
              },
              {
                'type': 'summary',
                'text': 'Minim sit Lorem incididunt reprehenderit aliqua cupidatat id aliquip consequat incididunt dolore in.'
              },
              {
                'type': 'step',
                'subtype': 'given',
                'nodes': [
                  {
                    'type': 'definition',
                    'text': 'Laborum ut exercitation laborum anim enim ad sit dolore id.'
                  },
                  {
                    'type': 'token',
                    'subtype': 'keyword',
                    'text': 'Given'
                  }
                ]
              },
              {
                'type': 'step',
                'subtype': 'and',
                'nodes': [
                  {
                    'type': 'definition',
                    'text': 'Dolor mollit nulla sit cupidatat nostrud adipisicing laboris eu consectetur sit minim.'
                  },
                  {
                    'type': 'token',
                    'subtype': 'keyword',
                    'text': 'And'
                  }
                ]
              },
              {
                'type': 'step',
                'subtype': 'but',
                'nodes': [
                  {
                    'type': 'definition',
                    'text': 'Dolor elit elit incididunt consequat esse elit.'
                  },
                  {
                    'type': 'token',
                    'subtype': 'keyword',
                    'text': 'But'
                  }
                ]
              },
              {
                'subtype': 'keyword',
                'text': 'Scenario',
                'type': 'token'
              },
              {
                'subtype': 'colon',
                'text': ':',
                'type': 'token'
              }
            ]
          }
        )
      )
    ).thenReturn('the return from run')

    this.document([
      'Scenario: Aute et laborum laboris laborum pariatur laboris velit ea aliquip ut dolore cillum.',
      '',
      '  Culpa nisi tempor sint voluptate cupidatat laborum ex duis non duis aliqua enim ex irure.',
      '  Minim sit Lorem incididunt reprehenderit aliqua cupidatat id aliquip consequat incididunt dolore in.',
      '',
      'Given Laborum ut exercitation laborum anim enim ad sit dolore id.',
      'And Dolor mollit nulla sit cupidatat nostrud adipisicing laboris eu consectetur sit minim.',
      'But Dolor elit elit incididunt consequat esse elit.'
    ].map(ln => `${ln}\n`))

    td.verify(
      this.fakeSuite(
        [
          `Scenario: Aute et laborum laboris laborum pariatur laboris velit ea aliquip ut dolore cillum.`,
          ``,
          `      Culpa nisi tempor sint voluptate cupidatat laborum ex duis non duis aliqua enim ex irure.`,
          `      Minim sit Lorem incididunt reprehenderit aliqua cupidatat id aliquip consequat incididunt dolore in.`,
          ``
        ].join('\n'),
        'the return from run'
      )
    )
  })
})
