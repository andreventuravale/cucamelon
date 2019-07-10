const { expect } = require('chai')

const parse = require('../../lib/parse')

suite('Parsing', () => {
  test('Breaks a text into an array of steps', () => {
    const text = `
      Given Laborum ut exercitation laborum anim enim ad sit dolore id.
      And   Dolor mollit nulla sit cupidatat nostrud adipisicing laboris eu consectetur sit minim.
      But   Dolor elit elit incididunt consequat esse elit.
      When  Ex exercitation velit mollit aliquip proident qui duis.
      And   Voluptate duis Lorem magna laboris aliquip fugiat elit culpa ad laborum.
      But   Ipsum mollit amet occaecat elit veniam sit.
      Then  Fugiat reprehenderit ullamco reprehenderit id eiusmod commodo magna aliquip velit exercitation.
      And   Culpa aute minim sit sint culpa ut proident eu minim voluptate magna proident occaecat.
      But   Irure aliquip id laboris elit est proident.
    `

    const steps = parse(text)

    expect(steps).to.be.eql([
      {
        text: 'Given Laborum ut exercitation laborum anim enim ad sit dolore id.',
        step: 'Laborum ut exercitation laborum anim enim ad sit dolore id.'
      },
      {
        text: 'And   Dolor mollit nulla sit cupidatat nostrud adipisicing laboris eu consectetur sit minim.',
        step: 'Dolor mollit nulla sit cupidatat nostrud adipisicing laboris eu consectetur sit minim.'
      },
      {
        text: 'But   Dolor elit elit incididunt consequat esse elit.',
        step: 'Dolor elit elit incididunt consequat esse elit.'
      },
      {
        text: 'When  Ex exercitation velit mollit aliquip proident qui duis.',
        step: 'Ex exercitation velit mollit aliquip proident qui duis.'
      },
      {
        text: 'And   Voluptate duis Lorem magna laboris aliquip fugiat elit culpa ad laborum.',
        step: 'Voluptate duis Lorem magna laboris aliquip fugiat elit culpa ad laborum.'
      },
      {
        text: 'But   Ipsum mollit amet occaecat elit veniam sit.',
        step: 'Ipsum mollit amet occaecat elit veniam sit.'
      },
      {
        text: 'Then  Fugiat reprehenderit ullamco reprehenderit id eiusmod commodo magna aliquip velit exercitation.',
        step: 'Fugiat reprehenderit ullamco reprehenderit id eiusmod commodo magna aliquip velit exercitation.'
      },
      {
        text: 'And   Culpa aute minim sit sint culpa ut proident eu minim voluptate magna proident occaecat.',
        step: 'Culpa aute minim sit sint culpa ut proident eu minim voluptate magna proident occaecat.'
      },
      {
        text: 'But   Irure aliquip id laboris elit est proident.',
        step: 'Irure aliquip id laboris elit est proident.'
      }
    ])
  })

  test('Ignores all lines that does not start with one of the following: "given", "when", "then", "and" or "but".', () => {
    const text = `

      # foo bar baz

      Scenario: foo bar baz

        Foo bar baz

      foo given is ignored
      bar when is ignored
      baz then is ignored
      qux and is ignored
      waldo but is ignored
      
      given foo is not ignored

      when bar is not ignored

      then baz is not ignored

      and qux is not ignored

      but waldo is not ignored

    `

    const steps = parse(text)

    expect(steps).to.be.eql([
      { text: 'given foo is not ignored', step: 'foo is not ignored' },
      { text: 'when bar is not ignored', step: 'bar is not ignored' },
      { text: 'then baz is not ignored', step: 'baz is not ignored' },
      { text: 'and qux is not ignored', step: 'qux is not ignored' },
      { text: 'but waldo is not ignored', step: 'waldo is not ignored' }
    ])
  })

  test('Keywords are case-insensitive', () => {
    const text = `
      gIven foo
      whEn bar
      tHen baz
      AND qux
      bUt waldo
    `

    const steps = parse(text)

    expect(steps).to.be.eql([
      { text: 'gIven foo', step: 'foo' },
      { text: 'whEn bar', step: 'bar' },
      { text: 'tHen baz', step: 'baz' },
      { text: 'AND qux', step: 'qux' },
      { text: 'bUt waldo', step: 'waldo' }
    ])
  })

  test('Given an empty text it returns an empty array', () => {
    const text = ` \r\n\t \t\n\r `

    const steps = parse(text)

    expect(steps).to.be.eql([])
  })

  test('Given an undefined text it throws an error', () => {
    expect(() => parse(undefined)).to.throw('The text input is not a string')
  })

  test('Given an null text it throws an error', () => {
    expect(() => parse(null)).to.throw('The text input is not a string')
  })
})
