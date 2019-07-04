const { expect } = require('chai')

const parse = require('../src/parse')

suite('Parsing', () => {
  test('Breaks a text into an array of steps', () => {
    const text = `
      given 1
      and   2
      but   3
      when  4
      and   5
      but   6
      then  7
      and   8
      but   9
    `

    const steps = parse(text)

    expect(steps).to.be.eql([
      { text: 'given 1', step: '1' },
      { text: 'and   2', step: '2' },
      { text: 'but   3', step: '3' },
      { text: 'when  4', step: '4' },
      { text: 'and   5', step: '5' },
      { text: 'but   6', step: '6' },
      { text: 'then  7', step: '7' },
      { text: 'and   8', step: '8' },
      { text: 'but   9', step: '9' }
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
    const text = `

    `

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
