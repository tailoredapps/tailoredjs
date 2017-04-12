const { expect } = require('chai')
const { BadRequest } = require('http-errors')

// Simple helper because expect(...).to.throw(ErrorClass) doesn't work with async functions for some reason - will fail even if ErrorClass is thrown
async function expectError (fn, errorType = BadRequest) {
  let err

  try {
    await fn()
  } catch (e) {
    err = e
  }

  expect(err).to.be.an.instanceof(errorType)
}

module.exports = {
  expectError
}
