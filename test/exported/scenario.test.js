const rewiremock = require('rewiremock').default
const td = require('testdouble')

suite('Exported / Scenario template function', () => {
  setup(function () {
    this.fakeRun = td.func()
    this.fakeSuite = td.func()

    this.Scenario = rewiremock.proxy('../../lib/Scenario', {
      './run-metadata': this.fakeRun,
      './suite': () => this.fakeSuite
    })
  })

  teardown(() => td.reset())

  test('Calls the suite definition as expected and delegates execution to the run function', function () {
    td.when(
      this.fakeRun(require('./metadata-with-summary.json'))
    ).thenReturn('the return from run(metadata)')

    this.Scenario([
      ': Aute et laborum laboris laborum pariatur laboris velit ea aliquip ut dolore cillum.',
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
          `      Culpa nisi tempor sint voluptate cupidatat laborum ex duis non duis aliqua enim ex irure.`,
          `      Minim sit Lorem incididunt reprehenderit aliqua cupidatat id aliquip consequat incididunt dolore in.`
        ].join('\n'),
        'the return from run(metadata)'
      )
    )
  })

  test('Calls the suite definition as expected and delegates execution to the run function', function () {
    td.when(
      this.fakeRun(require('./metadata-without-summary.json'))
    ).thenReturn('the return from run(metadata)')

    this.Scenario([
      ': Aute et laborum laboris laborum pariatur laboris velit ea aliquip ut dolore cillum.',
      '',
      'Given Laborum ut exercitation laborum anim enim ad sit dolore id.',
      'And Dolor mollit nulla sit cupidatat nostrud adipisicing laboris eu consectetur sit minim.',
      'But Dolor elit elit incididunt consequat esse elit.'
    ].map(ln => `${ln}\n`))

    td.verify(
      this.fakeSuite(
        [
          `Scenario: Aute et laborum laboris laborum pariatur laboris velit ea aliquip ut dolore cillum.`
        ].join('\n'),
        'the return from run(metadata)'
      )
    )
  })
})
