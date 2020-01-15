const rewiremock = require('rewiremock').default
const td = require('testdouble')

suite('Document template function', () => {
  setup(function () {
  })

  teardown(() => td.reset())

  test('Calls the suite definition as expected and delegates execution to the run function', function () {
    this.fakeRun = td.func()
    this.fakeSuite = td.func()

    td.when(
      this.fakeRun(require('./metadata.json'))
    ).thenReturn('the return from run(metadata)')

    this.document = rewiremock.proxy('../../lib/document', {
      './runWithMetadata': this.fakeRun,
      './suite': () => this.fakeSuite
    })

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
        'the return from run(metadata)'
      )
    )
  })
})
