const { expect } = require('chai')

const parse = require('../../lib/parse')

suite('Parsing', () => {
  test('Breaks a text into an array of steps', () => {
    const text = `
      Scenario: Aute et laborum laboris laborum pariatur laboris velit ea aliquip ut dolore cillum.

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

    const metadata = parse(text)

    expect(metadata).to.be.eql({
      'type': 'statement',
      'subtype': 'scenario',
      'nodes': [
        {
          'type': 'title',
          'text': 'Aute et laborum laboris laborum pariatur laboris velit ea aliquip ut dolore cillum.'
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
          'type': 'step',
          'subtype': 'when',
          'nodes': [
            {
              'type': 'definition',
              'text': 'Ex exercitation velit mollit aliquip proident qui duis.'
            },
            {
              'type': 'token',
              'subtype': 'keyword',
              'text': 'When'
            }
          ]
        },
        {
          'type': 'step',
          'subtype': 'and',
          'nodes': [
            {
              'type': 'definition',
              'text': 'Voluptate duis Lorem magna laboris aliquip fugiat elit culpa ad laborum.'
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
              'text': 'Ipsum mollit amet occaecat elit veniam sit.'
            },
            {
              'type': 'token',
              'subtype': 'keyword',
              'text': 'But'
            }
          ]
        },
        {
          'type': 'step',
          'subtype': 'then',
          'nodes': [
            {
              'type': 'definition',
              'text': 'Fugiat reprehenderit ullamco reprehenderit id eiusmod commodo magna aliquip velit exercitation.'
            },
            {
              'type': 'token',
              'subtype': 'keyword',
              'text': 'Then'
            }
          ]
        },
        {
          'type': 'step',
          'subtype': 'and',
          'nodes': [
            {
              'type': 'definition',
              'text': 'Culpa aute minim sit sint culpa ut proident eu minim voluptate magna proident occaecat.'
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
              'text': 'Irure aliquip id laboris elit est proident.'
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
    })
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

    const metadata = parse(text)

    expect(metadata).to.be.eql({
      'type': 'statement',
      'subtype': 'scenario',
      'nodes': [
        {
          'type': 'title',
          'text': 'foo bar baz'
        },
        {
          'type': 'summary',
          'text': 'Foo bar baz'
        },
        {
          'type': 'summary',
          'text': 'foo given is ignored'
        },
        {
          'type': 'summary',
          'text': 'bar when is ignored'
        },
        {
          'type': 'summary',
          'text': 'baz then is ignored'
        },
        {
          'type': 'summary',
          'text': 'qux and is ignored'
        },
        {
          'type': 'summary',
          'text': 'waldo but is ignored'
        },
        {
          'type': 'step',
          'subtype': 'given',
          'nodes': [
            {
              'type': 'definition',
              'text': 'foo is not ignored'
            },
            {
              'type': 'token',
              'subtype': 'keyword',
              'text': 'given'
            }
          ]
        },
        {
          'type': 'step',
          'subtype': 'when',
          'nodes': [
            {
              'type': 'definition',
              'text': 'bar is not ignored'
            },
            {
              'type': 'token',
              'subtype': 'keyword',
              'text': 'when'
            }
          ]
        },
        {
          'type': 'step',
          'subtype': 'then',
          'nodes': [
            {
              'type': 'definition',
              'text': 'baz is not ignored'
            },
            {
              'type': 'token',
              'subtype': 'keyword',
              'text': 'then'
            }
          ]
        },
        {
          'type': 'step',
          'subtype': 'and',
          'nodes': [
            {
              'type': 'definition',
              'text': 'qux is not ignored'
            },
            {
              'type': 'token',
              'subtype': 'keyword',
              'text': 'and'
            }
          ]
        },
        {
          'type': 'step',
          'subtype': 'but',
          'nodes': [
            {
              'type': 'definition',
              'text': 'waldo is not ignored'
            },
            {
              'type': 'token',
              'subtype': 'keyword',
              'text': 'but'
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
    })
  })

  test('Keywords are case-insensitive', () => {
    const text = `
      Scenario: foo

      gIven foo
      whEn bar
      tHen baz
      AND qux
      bUt waldo
    `

    const metadata = parse(text)

    expect(metadata).to.be.eql({
      'type': 'statement',
      'subtype': 'scenario',
      'nodes': [
        {
          'type': 'title',
          'text': 'foo'
        },
        {
          'type': 'step',
          'subtype': 'given',
          'nodes': [
            {
              'type': 'definition',
              'text': 'foo'
            },
            {
              'type': 'token',
              'subtype': 'keyword',
              'text': 'gIven'
            }
          ]
        },
        {
          'type': 'step',
          'subtype': 'when',
          'nodes': [
            {
              'type': 'definition',
              'text': 'bar'
            },
            {
              'type': 'token',
              'subtype': 'keyword',
              'text': 'whEn'
            }
          ]
        },
        {
          'type': 'step',
          'subtype': 'then',
          'nodes': [
            {
              'type': 'definition',
              'text': 'baz'
            },
            {
              'type': 'token',
              'subtype': 'keyword',
              'text': 'tHen'
            }
          ]
        },
        {
          'type': 'step',
          'subtype': 'and',
          'nodes': [
            {
              'type': 'definition',
              'text': 'qux'
            },
            {
              'type': 'token',
              'subtype': 'keyword',
              'text': 'AND'
            }
          ]
        },
        {
          'type': 'step',
          'subtype': 'but',
          'nodes': [
            {
              'type': 'definition',
              'text': 'waldo'
            },
            {
              'type': 'token',
              'subtype': 'keyword',
              'text': 'bUt'
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
    })
  })

  test('Given an empty text it returns an empty array', () => {
    const text = ' \r\n\t \t\n\r '

    expect(() => parse(text)).to.throw(`Sorry I could not understand the gherkin:

\`\`\`
${text}
\`\`\`

I was specting a feature, background, scenario, scenario outline, example, etc.`)
  })

  test('Given an undefined text it throws an error', () => {
    expect(() => parse(undefined)).to.throw('The text input is not a string')
  })

  test('Given an null text it throws an error', () => {
    expect(() => parse(null)).to.throw('The text input is not a string')
  })
})
