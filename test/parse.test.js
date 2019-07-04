const { expect } = require('chai')

const parse = require('../src/parse')

suite('Parsing', () => {
  test('Breaks a text into an array of steps', () => {
    const text = `
      given 1
      and 2
      but 3
      when 4
      and 5
      but 6
      then 7
      and 8
      but 9
    `

    const steps = parse(text)

    expect(steps).to.be.eql([
      '1', '2', '3', '4', '5', '6', '7', '8', '9'
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
      'foo is not ignored',
      'bar is not ignored',
      'baz is not ignored',
      'qux is not ignored',
      'waldo is not ignored'
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
      'foo',
      'bar',
      'baz',
      'qux',
      'waldo'
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
