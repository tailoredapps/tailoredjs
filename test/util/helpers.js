'use strict'

import { expect } from 'chai'
import { BadRequest } from 'http-errors'

// Simple helper because expect(...).to.throw(ErrorClass) doesn't work with async functions for some reason - will fail even if ErrorClass is thrown
export async function expectError (fn, errorType = BadRequest) {
  let err

  try {
    await fn()
  } catch (e) {
    err = e
  }

  expect(err).to.be.an.instanceof(errorType)
}
