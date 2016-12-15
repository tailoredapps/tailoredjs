'use strict'

import { expect } from 'chai'

import * as u from '../util'

describe('util module', function () {
  describe('replaceTokens', function () {
    it('replaces tokens in a string', function () {
      const source = 'foo {replaced} {notReplaced}'
      const replace = { replaced: 'bar', ignoredProp: 'dummy' }

      expect(u.replaceTokens(source, replace)).to.equal('foo bar {notReplaced}')
    })
  })

  describe('port adjusting', function () {
    const envVarName = '__MOCHA_DUMMY'

    before(() => {
      process.env[envVarName] = '1'
    })
    after(() => {
      delete process.env[envVarName]
    })

    it('adds the value of the specified env var', function () {
      expect(u.getAdjustedPort(1, envVarName)).to.equal(2)
    })

    it('returns the original value when the specified env var is NaN', function () {
      expect(u.getAdjustedPort(1, 'INVALID_NAME')).to.equal(1)
    })

    it('always returns a number', function () {
      expect(u.getAdjustedPort('1', envVarName)).to.be.a('number')
      expect(u.getAdjustedPort(1, envVarName)).to.be.a('number')
    })
  })
})
