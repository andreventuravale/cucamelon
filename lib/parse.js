function parse (text) {
  if (typeof text !== 'string') {
    throw new Error('The text input is not a string')
  }

  return text
    .trim()
    .split(/\n/g)
    .map(ln => ln.trim())
    .filter(ln => /^(given|when|then|and|but)/i.test(ln))
    .map(ln => ({
      text: ln,
      step: ln.slice(ln.indexOf(' ')).trim()
    }))
}

module.exports = parse
