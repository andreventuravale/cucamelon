const { parse } = require('nanospec')

module.exports = function (text) {
  if (typeof text !== 'string') {
    throw new Error(`The text input is not a string but "${typeof text}"`)
  }

  return parse(text)
}
